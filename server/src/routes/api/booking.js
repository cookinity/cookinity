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

router.get('/', async (req, res, next) => {
    try {
      //const { hostId } = req.query;
      let bookings = [];

      //all classes
      bookings = await Order.find().populate('customer').populate('class')

    

    for (const booking of bookings) {
        debugger
        const timeSlot = booking.timeSlots.id(booking.timeSlot)
        debugger
    }

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