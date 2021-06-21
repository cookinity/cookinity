const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { Router } from 'express';
import Class from '../../models/Class';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

const router = Router();

router.post('/create-checkout-session', [requireJwtAuth], async (req, res) => {
  try {
    const { classId, timeSlotId, numberOfGuests } = req.query;
    if (!numberOfGuests || !timeSlotId || !numberOfGuests) {
      return res.status(400).json({ message: 'Not all mandatory request parameters specified!' });
    }

    const c = await Class.findById(classId).populate('host');
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
    const cookinityFee = (Number(eventPrice) * 0.1).toFixed(2); // we take 10%
    debugger;
    const session = await stripe.checkout.sessions.create({
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
        {
          // marketplace fee
          price_data: {
            currency: 'EUR',
            product_data: {
              name: 'Cookinity Fee (10%)',
            },
            unit_amount: Number(cookinityFee) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL_DEV}?success=true`,
      cancel_url: `${process.env.CLIENT_URL_DEV}?canceled=true`,
    });
    res.json({ session });
  } catch (err) {}
});

export default router;
