import Joi from 'joi-oid';
import mongoose from 'mongoose';
const { Schema } = mongoose;

export const guestFeedbackSchema = new Schema(
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

guestFeedbackSchema.methods.toJSON = function () {
    return {
        id: this._id,
        numberOfStars: this.numberOfStars,
        reviewer: this.reviewer.toJSON(),
    };
};

export const guestFeedbackJoiSchema = Joi.object().keys({
    numberOfStars: Joi.number().min(1).max(5).positive().required(),
    reviewer: Joi.objectId().required(),
});

export const validateFeedback = (f) => {
    return guestFeedbackJoiSchema.validate(f);
};
