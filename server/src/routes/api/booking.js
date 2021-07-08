import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import Order from '../../models/Order';
import upload from '../../middleware/multer';
var ObjectId = require('mongoose').Types.ObjectId;

const router = Router();

router.get('/', [requireJwtAuth], async (req, res, next) => {
  try {

    const idOfLoggedInUser = req.user.id

    //const { hostId } = req.query;
    let bookings = [];

    //all classes
    bookings = await Order.find({ host: idOfLoggedInUser }).populate('customer').populate('class')

    res.json({
      bookings: bookings.map((b) => {
        return b.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/ofuser', [requireJwtAuth], async (req, res, next) => {
  try {

    const idOfLoggedInUser = req.user.id

    //const { hostId } = req.query;
    let bookings = [];

    //all classes
    bookings = await Order.find({ customer: idOfLoggedInUser }).populate('host').populate('class')

    res.json({
      bookings: bookings.map((b) => {
        return b.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
