import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { timeSlotSchema } from './Class';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    bookedTimeSlot: {
      type: timeSlotSchema,
      required: true,
    },
    stripeSession: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    numberOfGuests: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    totalPrice: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    currency: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    bookingDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    }
  }
);

orderSchema.methods.toJSON = function () {
  return {
    id: this._id,
    customer: this.customer.toJSON(),
    class: this.class.toJSON(),
    host: this.host.toJSON(),
    bookedTimeSlot: this.bookedTimeSlot.toJSON(),
    stripeSession: this.stripeSession,
    numberOfGuests: this.numberOfGuests,
    totalPrice: this.totalPrice,
    currency: this.currency,
    bookingDate: this.bookingDate
  };
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
