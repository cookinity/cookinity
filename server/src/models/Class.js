import Joi from 'joi';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { join } from 'path';
import fs from 'fs';
import { isValidUrl } from '../utils/utils';
dayjs.extend(utc);
const { Schema } = mongoose;
import { CLASS_CATEGORIES } from './ClassCategories';

const addressSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
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
    category: {
      type: String,
      enum: CLASS_CATEGORIES,
      required: true,
    },
    description: {
      type: String,
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
    bookableDates: [Date],
  },
  { timestamps: true },
);

classSchema.methods.toJSON = function () {
  const absoluteCoverPhotoPath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.coverPhoto}`;
  let coverPhoto = undefined;
  if (!this.coverPhoto || !fs.existsSync(absoluteCoverPhotoPath)) {
    coverPhoto = `${process.env.IMAGES_FOLDER_PATH}dummyCover.png`;
  } else {
    coverPhoto = `${process.env.IMAGES_FOLDER_PATH}${this.coverPhoto}`;
  }
  return {
    id: this._id,
    title: this.title,
    coverPhoto,
    category: this.category,
    description: this.description,
    meetingAddress: this.meetingAddress.toJSON(),
    host: this.host.toJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    bookableDates: this.bookableDates.map((date) => {
      // format as a string using dayjs (can be parsed on the frontend using dayjs) ! This will be also UTC --> convert it for display in frontend using dayjs if necessary
      return dayjs(date).utc().toJSON();
    }),
  };
};

export const validateClass = (c) => {
  const addressSchema = Joi.object()
    .keys({
      country: Joi.string().required(),
      city: Joi.string().required(),
      zip: Joi.string().required(),
      state: Joi.string().required(),
      street: Joi.string().required(),
    })
    .required();

  const classSchema = Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.string()
      .valid(...CLASS_CATEGORIES)
      .required(),
    description: Joi.string().required(),
    meetingAddress: addressSchema,
    bookableDates: Joi.array().items(Joi.date()),
  });

  return classSchema.validate(c);
};

const Class = mongoose.model('Class', classSchema);

export default Class;
