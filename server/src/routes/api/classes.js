import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import Class, { validateClass, validateTimeSlot } from '../../models/Class';
import upload from '../../middleware/multer';
import { validateFeedback } from '../../models/Feedback';
var ObjectId = require('mongoose').Types.ObjectId;

const router = Router();

var photosUpload = upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photoOne', maxCount: 1 },
  { name: 'photoTwo', maxCount: 1 },
]);

router.get('/', async (req, res, next) => {
  try {
    const { hostId } = req.query;
    let classes = [];
    if (hostId) {
      // classes by the specified host
      classes = await Class.find({ host: new ObjectId(hostId) }).populate('host');
    } else {
      // all classes
      classes = await Class.find().populate('host');
    }

    res.json({
      classes: classes.map((c) => {
        return c.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const c = await Class.findById(req.params.id).populate('host');
    if (!c) return res.status(404).json({ message: 'No class found.' });
    res.json({ class: c.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// A host can not delete a class once a date is booked for it
router.delete('/:id', [requireJwtAuth], async (req, res, next) => {
  try {
    const tempClass = await Class.findById(req.params.id).populate('host');
    // check that the class exists in the database
    if (!tempClass) {
      return res.status(404).json({ message: 'Class not found!' });
    }
    // check that the user making the request is the host of the class or an admin
    if (!(tempClass.host.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'Only the host of a class can delete a class!' });
    }
    // check that no time slot is booked yet
    tempClass.timeSlots.map((timeSlot) => {
      if (timeSlot.isBooked) {
        return res.status(403).json({ message: 'You can not delete a class that has already been booked!' });
      }
    });

    const c = await Class.findByIdAndDelete(tempClass._id);
    res.status(200).json({ c });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', [requireJwtAuth, photosUpload], async (req, res, next) => {
  try {
    const tempClass = await Class.findById(req.params.id).populate('host');
    // check that the class exists in the database
    if (!tempClass) {
      return res.status(404).json({ message: 'Class not found!' });
    }
    // check that the user making the request is the host of the class or an admin
    if (!(tempClass.host.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'Only the host of a class can edit a class!' });
    }

    let coverPhoto = undefined;
    let photoOne = undefined;
    let photoTwo = undefined;

    if (req.files) {
      if (req.files['coverPhoto'] && req.files['coverPhoto'][0]) {
        coverPhoto = req.files['coverPhoto'][0].filename;
      }
      if (req.files['photoOne'] && req.files['photoOne'][0]) {
        photoOne = req.files['photoOne'][0].filename;
      }
      if (req.files['photoTwo'] && req.files['photoTwo'][0]) {
        photoTwo = req.files['photoTwo'][0].filename;
      }
    }

    const updatedClass = {
      title: req.body.title,
      coverPhoto: coverPhoto,
      photoOne: photoOne,
      photoTwo: photoTwo,
      category: req.body.category,
      description: req.body.description,
      toBring: req.body.toBring,
      meetingAddress: req.body.meetingAddress,
      pricePerPerson: req.body.pricePerPerson,
      durationInMinutes: req.body.durationInMinutes,
      minGuests: req.body.minGuests,
      maxGuests: req.body.maxGuests,
      veganFriendly: req.body.veganFriendly,
      vegetarianFriendly: req.body.vegetarianFriendly,
      nutAllergyFriendly: req.body.nutAllergyFriendly,
    };

    Object.keys(updatedClass).forEach((key) => (updatedClass[key] === undefined ? delete updatedClass[key] : {}));

    const c = await Class.findByIdAndUpdate(tempClass._id, { $set: updatedClass }, { new: true });

    res.status(200).json({ c });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:classId/timeslots/:tsId', [requireJwtAuth], async (req, res, next) => {
  try {
    const tempClass = await Class.findById(req.params.classId).populate('host');
    // check that the class exists in the database
    if (!tempClass) {
      return res.status(404).json({ message: 'Class not found!' });
    }
    // check that the user making the request is the host of the class or an admin
    if (!(tempClass.host.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'Only the host of a class can edit a class!' });
    }
    tempClass.timeSlots.id(req.params.tsId).remove();
    await tempClass.save();
    res.status(200).json({ tempClass });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/:id/timeslots', [requireJwtAuth], async (req, res, next) => {
  try {
    const tempClass = await Class.findById(req.params.id).populate('host');
    // check that the class exists in the database
    if (!tempClass) {
      return res.status(404).json({ message: 'Class not found!' });
    }
    // check that the user making the request is the host of the class or an admin
    if (!(tempClass.host.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'Only the host of a class can edit a class!' });
    }

    const newTimeSlot = {
      date: req.body.date,
      isBooked: false,
    };

    const { error } = validateTimeSlot(newTimeSlot);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const durationInMinutes = tempClass.durationInMinutes ? tempClass.durationInMinutes : 0;

    const newTimeSlotBeginning = dayjs(newTimeSlot.date);
    const newTimeSlotEnd = newTimeSlotBeginning.add(durationInMinutes, 'minutes');

    for (var i = 0; i < tempClass.timeSlots.length; i++) {
      const oldTimeSlotBeginning = dayjs(tempClass.timeSlots[i].date);
      const oldTimeSlotEnd = oldTimeSlotBeginning.add(durationInMinutes, 'minutes');

      if (oldTimeSlotBeginning.isSameOrBefore(newTimeSlotEnd) && oldTimeSlotEnd.isSameOrAfter(newTimeSlotBeginning)) {
        return res.status(400).json({ message: 'The new time slot overlaps with another time slot of the same class' });
      }
    }
    tempClass.timeSlots.push(newTimeSlot);
    let updatedClass = {
      timeSlots: tempClass.timeSlots,
    };
    updatedClass = await Class.findByIdAndUpdate(tempClass._id, { $set: updatedClass }, { new: true });

    res.status(200).json({ updatedClass });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/:id/feedbacks', [requireJwtAuth], async (req, res, next) => {
  try {
    const tempClass = await Class.findById(req.params.id).populate('host');
    // check that the class exists in the database
    if (!tempClass) {
      return res.status(404).json({ message: 'Class not found!' });
    }

    const newFeedback = {
      overallRatingStars: req.body.overallRatingStars,
      overallRating: req.body.overallRating,
      hostRatingStars: req.body.hostRatingStars,
      hostRating: req.body.hostRating,
      tasteRatingStars: req.body.tasteRatingStars,
      tasteRating: req.body.tasteRating,
      locationRatingStars: req.body.locationRatingStars,
      locationRating: req.body.locationRating,
      vtmrRatingStars: req.body.vtmrRatingStars,
      vtmrRating: req.body.vtmrRating,
      experienceRatingStars: req.body.experienceRatingStars,
      experienceRating: req.body.experienceRating,
      reviewer: req.user.id,
    };

    // ToDo: We need to add verification such that only people who have really booked the class can make a review
    const { error } = validateFeedback(newFeedback);
    if (error) return res.status(400).json({ message: error.details[0].message });
    tempClass.feedbacks.push(newFeedback);
    let updatedClass = {
      feedbacks: tempClass.feedbacks,
    };
    updatedClass = await Class.findByIdAndUpdate(tempClass._id, { $set: updatedClass }, { new: true });

    res.status(200).json({ updatedClass });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', [requireJwtAuth, photosUpload], async (req, res, next) => {
  let coverPhoto = undefined;
  let photoOne = undefined;
  let photoTwo = undefined;

  if (req.files) {
    if (req.files['coverPhoto'] && req.files['coverPhoto'][0]) {
      coverPhoto = req.files['coverPhoto'][0].filename;
    }
    if (req.files['photoOne'] && req.files['photoOne'][0]) {
      photoOne = req.files['photoOne'][0].filename;
    }
    if (req.files['photoTwo'] && req.files['photoTwo'][0]) {
      photoTwo = req.files['photoTwo'][0].filename;
    }
  }

  const c = {
    title: req.body.title,
    coverPhoto: coverPhoto,
    photoOne: photoOne,
    photoTwo: photoTwo,
    category: req.body.category,
    description: req.body.description,
    toBring: req.body.toBring,
    meetingAddress: req.body.meetingAddress,
    pricePerPerson: req.body.pricePerPerson,
    durationInMinutes: req.body.durationInMinutes,
    minGuests: req.body.minGuests,
    maxGuests: req.body.maxGuests,
    veganFriendly: req.body.veganFriendly,
    vegetarianFriendly: req.body.vegetarianFriendly,
    nutAllergyFriendly: req.body.nutAllergyFriendly,
    host: req.user.id, // added by authentication middleware to request --> frontend does not need to send it
  };

  Object.keys(c).forEach((key) => (c[key] === undefined ? delete c[key] : {}));

  const { error } = validateClass(c);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let newClass = await Class.create(c);
    newClass = await newClass.populate('host').execPopulate();
    res.status(200).json({ class: newClass.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong during the class creation.' });
  }
});

export default router;
