import Joi from 'joi-oid';
import mongoose from 'mongoose';
const { Schema } = mongoose;

export const feedbackSchema = new Schema({
  overallRatingStars: {
    type: Number,
    required: true,
  },
  hostRatingStars: {
    type: Number,
    required: true,
  },
  tasteRatingStars: {
    type: Number,
    required: true,
  },
  locationRatingStars: {
    type: Number,
    required: true,
  },
  vtmrRatingStars: {
    type: Number,
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  experienceRatingStars: {
    type: Number,
    required: true,
  },

  //Description
  overallRating: {
    type: String,
    default: '',
  },

  feedbackDate: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
});

feedbackSchema.methods.toJSON = function () {
  return {
    id: this._id,
    overallRatingStars: this.overallRatingStars,
    overallRating: this.overallRating,
    hostRatingStars: this.hostRatingStars,
    tasteRatingStars: this.tasterankingstars,
    locationRatingStars: this.locationRatingStars,
    vtmrRatingStars: this.vtmrRatingStars,
    experienceRatingStars: this.experienceRatingStars,
    reviewer: this.reviewer.toJSON(),
    feedbackDate: this.feedbackDate,
  };
};

export const feedbackJoiSchema = Joi.object().keys({
  overallRatingStars: Joi.number().min(1).max(5).positive().required(),
  overallRating: Joi.string().required(),
  hostRatingStars: Joi.number().min(1).max(5).positive().required(),
  tasteRatingStars: Joi.number().min(1).max(5).positive().required(),
  locationRatingStars: Joi.number().min(1).max(5).positive().required(),
  vtmrRatingStars: Joi.number().min(1).max(5).positive().required(),
  experienceRatingStars: Joi.number().min(1).max(5).positive().required(),
  reviewer: Joi.objectId().required(),
  feedbackDate: Joi.date().required(),
});

export const validateFeedback = (f) => {
  return feedbackJoiSchema.validate(f);
};
