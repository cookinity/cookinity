import Joi from 'joi-oid';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
const { Schema } = mongoose;

const classSchema = new Schema(
    {
        //Stars
        OverallRankingStars: {
            type: Number,
            required: true,
        },
        HostRankingStars: {
            type: Number,
            required: true,
        },
        TasteRankingStars: {
            type: Number,
            required: true,
        },
        LocationRankingStars: {
            type: Number,
            required: true,
        },
        VTMRRankingStars: {
            type: Number,
            required: true,
        },
        ExperienceRankingStars: {
            type: Number,
            required: true,
        },

        //Description 
        OverallRanking: {
            type: String,
            default: '',
        },

        HostRanking: {
            type: String,
            default: '',
        },

        TasteRanking: {
            type: String,
            default: '',
        },

        LocationRanking: {
            type: String,
            default: '',
        },
        VTMRRanking: {
            type: String,
            default: '',
        },
        ExperienceRanking: {
            type: String,
            default: '',
        },
    },
    { timestamps: true },
);

classSchema.methods.toJSON = function () {
    return {
        id: this._id,
        overallrankingstars: this.OverallRankingStars,
        overallranking: this.OverallRanking,
        hostrankingstars: this.HostRankingStars,
        hostranking: this.HostRanking,
        tasterankingstars: this.TasteRankingStars,
        tasteranking: this.TasteTanking,
        locationratingstars: this.LocationRankingStars,
        locationrating: this.LocationRanking,
        vtmrrankingstars: this.VTMRRankingStars,
        vtmrranking: this.VTMRRanking,
        experiencerankingstars: this.ExperienceRankingStars,
        experienceranking: this.ExperienceRanking,
    };
};

export const validateClass = (c) => {
    const classSchema = Joi.object().keys({
        overallrankingstars: Joi.string(),
        overallranking: Joi.number().integer().min(1).max(5).positive().required(),
        hostrankingstars: Joi.number().integer().min(1).max(5).positive().required(),
        hostranking: Joi.string(),
        tasterankingstars: Joi.number().integer().min(1).max(5).positive().required(),
        tasteranking: Joi.string(),
        locationratingstars: Joi.number().integer().min(1).max(5).positive().required(),
        locationrating: Joi.string(),
        vtmrrankingstars: Joi.number().integer().min(1).max(5).positive().required(),
        vtmrranking: Joi.string(),
        experiencerankingstars: tJoi.number().integer().min(1).max(5).positive().required(),
        experienceranking: Joi.string(),
    });
    return classSchema.validate(c);
};

const Class = mongoose.model('Feedback', classSchema);

export default Class;