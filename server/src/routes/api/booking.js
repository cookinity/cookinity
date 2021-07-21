import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Order from '../../models/Order';

const router = Router();

router.get('/ashost', [requireJwtAuth], async (req, res) => {
  try {
    const idOfLoggedInUser = req.user.id;
    let bookings = [];
    // find all bookings where the user is the host
    bookings = await Order.find({ host: idOfLoggedInUser }).populate('customer').populate('class');

    res.json({
      bookings: bookings.map((b) => {
        return b.toJSON();
      }),
    });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }
});

router.get('/ascustomer', [requireJwtAuth], async (req, res) => {
  try {
    const idOfLoggedInUser = req.user.id;

    let bookings = [];
    // find all bookings where the user is the customer
    bookings = await Order.find({ customer: idOfLoggedInUser }).populate('host').populate('class');

    res.json({
      bookings: bookings.map((b) => {
        let booking = b.toJSON();
        booking.privateInformation = b.class.privateInformation;
        return booking;
      }),
    });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }
});

export default router;
