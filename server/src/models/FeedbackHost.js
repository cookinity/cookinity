import Joi from 'joi-oid';
import mongoose from 'mongoose';
const { Schema } = mongoose;

export const feedbackHostSchema = new Schema(
    {
        //Stars
        numberOfStars: {
            type: Number,
            required: true,
        },
        //persons
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
        numberOfStars: this.numberOfStars,
        reviewer: this.reviewer.toJSON(),
    };
};

export const feedbackHostJoiSchema = Joi.object().keys({
    numberOfStars: Joi.number().min(1).max(5).positive().required(),
});

export const validateFeedback = (f) => {
    return feedbackHostJoiSchema.validate(f);
};
