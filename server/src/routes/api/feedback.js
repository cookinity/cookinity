import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Feedback, { validateClass } from '../../models/Feedback';
import upload from '../../middleware/multer';
var ObjectId = require('mongoose').Types.ObjectId;

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const { hostId } = req.query;
        let feedbacks = [];
        if (hostId) {
            // feeedback by the specified users
            feedbacks = await Feedback.find({ host: new ObjectId(hostId) }).populate('host');
        } else {
            // all feedbacks
            feedbacks = await v.find().populate('host');
        }

        res.json({
            feedbacks: feedbacks.map((c) => {
                return c.toJSON();
            }),
        });
    } catch (err) {
        if (err.message) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Something went wrong during giving feedback.' });
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        const c = await Feedback.findById(req.params.id).populate('host');
        if (!c) return res.status(404).json({ message: 'No feedback found.' });
        res.json({ class: c.toJSON() });
    } catch (err) {
        if (err.message) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Something went wrong during giving feedback.' });
        }
    }
});

router.post('/', [requireJwtAuth, photosUpload], async (req, res, next) => {
    debugger;

    const c = {
        host: req.user.id, // added by authentication middleware to request --> frontend does not need to send it
        //classid missing
        overallrankingstars: req.body.overallrankingstars,
        overallranking: req.body.overallranking,
        hostrankingstars: req.body.hostrankingstars,
        hostranking: req.body.hostranking,
        tasterankingstars: req.body.tasterankingstars,
        tasteranking: req.body.tasteranking,
        locationratingstars: req.body.locationratingstars,
        locationrating: req.body.locationrating,
        vtmrrankingstars: req.body.vtmrrankingstars,
        vtmrranking: req.body - vtmrranking,
        experiencerankingstars: req.body.experiencerankingstars,
        experienceranking: req.body.experienceranking,
    };

    Object.keys(c).forEach((key) => (c[key] === undefined ? delete c[key] : {}));

    const { error } = validateClass(c);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        let newFeedback = await Feedback.create(c);
        newFeedback = await newFeedback.populate('host').execPopulate();
        res.status(200).json({ class: newClass.toJSON() });
    } catch (err) {
        if (err.message) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Something went wrong during giving feedback.' });
        }
    }
});

export default router;
