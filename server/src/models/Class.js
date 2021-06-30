import Joi from 'joi-oid';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { join } from 'path';
import fs from 'fs';
dayjs.extend(utc);
const { Schema } = mongoose;
import { CLASS_CATEGORIES } from '../constants/ClassCategories';
import { CITY_CATEGORIES } from '../constants/CityCategories';

const mongoosePaginate = require('mongoose-paginate-v2');

const addressSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    enum: CITY_CATEGORIES,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
});

export const timeSlotSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

timeSlotSchema.methods.toJSON = function () {
  return {
    id: this._id,
    date: dayjs(this.date).utc().toJSON(),
    isBooked: this.isBooked, // only time slots that are not yet booked can be deleted by the user again
  };
};

addressSchema.methods.toJSON = function () {
  return {
    country: this.country,
    city: this.city,
    zip: this.zip,
    state: this.state,
    street: this.street,
  };
};

const classSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    photoOne: {
      type: String,
      required: false,
    },
    photoTwo: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      enum: CLASS_CATEGORIES,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    toBring: {
      type: String,
      default: '',
    },
    pricePerPerson: {
      type: Number,
      required: true,
    },
    durationInMinutes: {
      type: Number,
      required: true,
    },
    minGuests: {
      type: Number,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    meetingAddress: {
      type: addressSchema,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timeSlots: [timeSlotSchema],
    veganFriendly: {
      type: Boolean,
      default: false,
    },
    vegetarianFriendly: {
      type: Boolean,
      default: false,
    },
    nutAllergyFriendly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

classSchema.methods.toJSON = function () {
  // cover photo
  const absoluteCoverPhotoPath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.coverPhoto}`;
  let coverPhoto = undefined;
  if (!this.coverPhoto || !fs.existsSync(absoluteCoverPhotoPath)) {
    coverPhoto = `${process.env.IMAGES_FOLDER_PATH}dummyCover.png`; // actually not needed as there should always be one but just to be safe
  } else {
    coverPhoto = `${process.env.IMAGES_FOLDER_PATH}${this.coverPhoto}`;
  }
  // photo one
  const absolutePhotoOnePath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.photoOne}`;
  let photoOne = undefined;
  if (this.photoOne && fs.existsSync(absolutePhotoOnePath)) {
    photoOne = `${process.env.IMAGES_FOLDER_PATH}${this.photoOne}`;
  }

  // photo two
  const absolutePhotoTwoPath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.photoTwo}`;
  let photoTwo = undefined;
  if (this.photoTwo && fs.existsSync(absolutePhotoTwoPath)) {
    photoTwo = `${process.env.IMAGES_FOLDER_PATH}${this.photoTwo}`;
  }

  return {
    id: this._id,
    title: this.title,
    coverPhoto,
    photoOne,
    photoTwo,
    category: this.category,
    description: this.description,
    toBring: this.toBring,
    meetingAddress: this.meetingAddress.toJSON(),
    host: this.host.toJSON(),
    pricePerPerson: this.pricePerPerson,
    durationInMinutes: this.durationInMinutes,
    minGuests: this.minGuests,
    maxGuests: this.maxGuests,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    veganFriendly: this.veganFriendly,
    vegetarianFriendly: this.vegetarianFriendly,
    nutAllergyFriendly: this.nutAllergyFriendly,
    timeSlots: this.timeSlots.map((timeSlot) => {
      return timeSlot.toJSON();
    }),
  };
};

const timeSlotJoiSchema = Joi.object().keys({
  date: Joi.date().required(),
  isBooked: Joi.boolean(),
});

const addressJoiSchema = Joi.object().keys({
  country: Joi.string().required(),
  city: Joi.string().required(),
  zip: Joi.string().required(),
  state: Joi.string().required(),
  street: Joi.string().required(),
});

export const validateTimeSlot = (ts) => {
  return timeSlotJoiSchema.validate(ts);
};
export const validateClass = (c) => {
  const classJoiSchema = Joi.object().keys({
    title: Joi.string().required(),
    coverPhoto: Joi.string().required(),
    host: Joi.objectId().required(),
    photoOne: Joi.string(),
    photoTwo: Joi.string(),
    category: Joi.string()
      .valid(...CLASS_CATEGORIES)
      .required(),
    description: Joi.string().required(),
    toBring: Joi.string(),
    pricePerPerson: Joi.number().precision(2).positive(), // by default we assume in euro right now
    durationInMinutes: Joi.number().integer().min(1).positive().required(),
    minGuests: Joi.number().integer().min(1).max(100).positive().required(),
    maxGuests: Joi.number().integer().min(1).max(100).positive().required(),
    meetingAddress: addressJoiSchema.required(),
    timeSlots: Joi.array().items(timeSlotJoiSchema),
    veganFriendly: Joi.boolean(),
    vegetarianFriendly: Joi.boolean(),
    nutAllergyFriendly: Joi.boolean(),
  });

  return classJoiSchema.validate(c);
};

classSchema.plugin(mongoosePaginate);

const Class = mongoose.model('Class', classSchema);

export default Class;
