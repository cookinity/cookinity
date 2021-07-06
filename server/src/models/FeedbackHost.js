import Joi from 'joi-oid';
import mongoose from 'mongoose';
const { Schema } = mongoose;

export const feedbackHostSchema = new Schema(
    {
        //Stars
        ratingCustomerStar: {
            type: Number,
            required: true,
        },
        //text
        ratingCustomer: {
            type: String,
            default: '',
            required: true,
        },
        //persons
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);

feedbackHostSchema.methods.toJSON = function () {
    return {
        id: this._id,
        ratingCustomerStar: this.overallRatingStars,
        ratingCustomer: this.overallRating,
        reviewer: this.reviewer.toJSON(),
        customer: this.customer.toJSON(),
    };
};

export const feedbackHostJoiSchema = Joi.object().keys({
    ratingCustomerStar: Joi.number().min(1).max(5).positive().required(),
    ratingCustomer: Joi.string().required(),
});

export const validateFeedback = (f) => {
    return feedbackHostJoiSchema.validate(f);
};
