import mongoose from 'mongoose';
import { timeSlotSchema } from './Class';
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    customer: {
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
  },
  { timestamps: true },
);

orderSchema.methods.toJSON = function () {
  return {
    id: this._id,
    customer: this.customer.toJSON(),
    class: this.class.toJSON(),
    bookedTimeSlot: this.timeSlot.toJSON(),
    stripeSession: this.stripeSession,
  };
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
