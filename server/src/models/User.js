import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';
import { guestFeedbackJoiSchema, guestFeedbackSchema } from './FeedbackHost';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // for now only e-mail, could be also facebook or google auth
    provider: {
      type: String,
      required: true,
    },
    hasStripeAccount: {
      type: Boolean,
      default: false,
    },
    stripeAccountId: {
      type: String,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 60,
    },
    feedbacksAsGuests: [guestFeedbackSchema],
    avgRatingAsGuest: {
      type: Number,
      required: false
    },
    description: {
      type: String,
      lowercase: true,
      index: true,
    },
    name: String,
    avatar: String,
    role: { type: String, default: 'USER' },
    bio: String,
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  // if not exists avatar1 default
  const absoluteAvatarFilePath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.avatar}`;
  const avatar = isValidUrl(this.avatar)
    ? this.avatar
    : fs.existsSync(absoluteAvatarFilePath)
      ? `${process.env.IMAGES_FOLDER_PATH}${this.avatar}`
      : `${process.env.IMAGES_FOLDER_PATH}avatar1.jpg`;

  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    username: this.username,
    hasStripeAccount: this.hasStripeAccount,
    stripeAccountId: this.stripeAccountId,
    description: this.description,
    avatar: avatar,
    name: this.name,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    avgRatingAsGuest: this.avgRatingAsGuest,
  };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      provider: this.provider,
      email: this.email,
    },
    secretOrKey,
  );
  return token;
};

userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }
      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

export async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
}

export const validateUser = (user) => {
  const schema = Joi.object().keys({
    avatar: Joi.any(),
    name: Joi.string().min(2).max(30).required(),
    hasStripeAccount: Joi.boolean(),
    stripeAccountId: Joi.string(),
    username: Joi.string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/)
      .required(),
    password: Joi.string().min(6).max(20).allow('').allow(null),
    description: Joi.string().min(2).max(1000),
    feedbacksAsGuests: Joi.array().items(guestFeedbackJoiSchema),
  });

  return schema.validate(user);
};

const User = mongoose.model('User', userSchema);

export default User;
