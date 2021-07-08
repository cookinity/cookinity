const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { Router } from 'express';
import Class from '../../models/Class';
import User from '../../models/User';
import Order from '../../models/Order';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const router = Router();

// Stripe will contact this endpoint throughout the payment lifecycle
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  // verify that request really came from stripe
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event --> customer payment for the cooking class
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, classId, timeSlotId, guestNumber } = session.metadata;
    const c = await Class.findById(classId);
    const ts = c.timeSlots.id(timeSlotId);

    const order = {
      customer: userId,
      class: classId,
      host: c.host,
      bookedTimeSlot: ts,
      stripeSession: session,
      numberOfGuests: guestNumber,
      totalPrice: session.amount_total,
      currency: session.currency,
      bookingDate: dayjs().utc().toJSON()
    };

    try {
      // 1. Create New Order
      let newOrder = await Order.create(order);
      // 2. Set Time Slot IsBooked
      c.timeSlots.id(timeSlotId).isBooked = true;
      await c.save();
      res.status(200);
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }

  if (event.type === 'account.updated') {
    const account = event.data.object;
    // stripe can make payouts to this account
    if (account.payouts_enabled) {
      const { userId } = account.metadata;
      const user = await User.findById(userId).exec();
      if (user && !user.hasStripeAccount) {
        const updatedUser = {
          hasStripeAccount: true,
          stripeAccountId: account.id,
        };
        await User.findByIdAndUpdate(userId, { $set: updatedUser }, { new: true });
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

router.post('/generate-dashboard-link', [requireJwtAuth], async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    if (!user.hasStripeAccount || !user.stripeAccountId) {
      return res.status(400).json({ message: 'User has no stripe account' });
    }
    const link = await stripe.accounts.createLoginLink(user.stripeAccountId);
    res.send({ url: link.url });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

router.post('/onboard-user', [requireJwtAuth], async (req, res) => {
  const email = req.user.email;

  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      business_type: 'individual',
      business_profile: {
        product_description: 'Hosting Cooking Courses On Cookinity',
      },
      metadata: {
        username: req.user.username,
        userId: req.user.id,
      },
    });
    const origin = `${req.headers.origin}`;
    const accountLinkURL = await generateAccountLink(account.id, origin);
    res.send({ url: accountLinkURL });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

function generateAccountLink(accountID, origin) {
  return stripe.accountLinks
    .create({
      type: 'account_onboarding',
      account: accountID,
      //ToDo: Correctly implement refresh for best user experience
      refresh_url: `${process.env.CLIENT_URL_DEV}/hostmanagement`,
      return_url: `${process.env.CLIENT_URL_DEV}/hostmanagement?success=true`,
    })
    .then((link) => link.url);
}

router.post('/create-checkout-session', [requireJwtAuth], async (req, res) => {
  debugger;
  try {
    const { classId, timeSlotId, numberOfGuests } = req.query;
    if (!numberOfGuests || !timeSlotId || !numberOfGuests) {
      return res.status(400).json({ message: 'Not all mandatory request parameters specified!' });
    }

    const c = await Class.findById(classId).populate('host');
    if (!c.host.hasStripeAccount || !c.host.stripeAccountId) {
      return res.status(400).json({ message: 'Host has no connected stripe account!' });
    }
    // check that the class exists in the database
    if (!c) {
      return res.status(404).json({ message: 'Class not found!' });
    }
    const ts = c.timeSlots.id(timeSlotId);
    if (!ts) {
      return res.status(404).json({ message: 'Time slot not found!' });
    }
    if (ts.isBooked) {
      return res.status(400).json({ message: 'Time slot already booked!' });
    }
    // calculate prices
    const eventPrice = (c.pricePerPerson * Number(numberOfGuests)).toFixed(2);
    const cookinityFee = (Number(eventPrice) * 0.1).toFixed(2); // we take 10% of the purchase price

    const session = await stripe.checkout.sessions.create({
      metadata: {
        userId: req.user.id,
        classId: classId,
        timeSlotId: timeSlotId,
        guestNumber: numberOfGuests,
      },
      payment_method_types: ['card'],
      line_items: [
        {
          // event
          price_data: {
            currency: 'EUR',
            product_data: {
              name: `${c.title} on ${dayjs(ts.date).format('llll')}`,
            },
            unit_amount: Number(eventPrice) * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Number(cookinityFee) * 100,
        transfer_data: {
          destination: c.host.stripeAccountId,
        },
      },
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL_DEV}/classes/${c.id}/booking?success=true`,
      cancel_url: `${process.env.CLIENT_URL_DEV}/classes/${c.id}/booking?canceled=true`,
    });
    res.json({ session });
  } catch (err) { }
});

export default router;
