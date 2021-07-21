import { Router } from 'express';
import { validateFeedback } from '../../models/Feedback';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import passport from 'passport';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import Class, { validateClass, validateTimeSlot } from '../../models/Class';
import Order from '../../models/Order';
import upload from '../../middleware/multer';
var ObjectId = require('mongoose').Types.ObjectId;

const router = Router();

var photosUpload = upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photoOne', maxCount: 1 },
  { name: 'photoTwo', maxCount: 1 },
]);

router.post('/query', passport.authenticate(['jwt', 'anonymous'], { session: false }), async (req, res, next) => {
  let {
    city,
    category,
    date,
    guests,
    priceLow,
    priceUp,
    rating,
    vegan,
    vegetarian,
    nutAllergy,
    pescatarian,
    eggFree,
    soyFree,
    limit,
    skip,
  } = req.body;

  if (date) {
    date = dayjs(date);
  }

  try {
    let classes = await Class.find();

    // Apply City Filter
    if (city) {
      classes = classes.filter((c) => c.meetingAddress.city === city);
    }

    // Apply Category Filter
    if (category) {
      classes = classes.filter((c) => c.category === category);
    }

    // Apply Date Filter
    if (date) {
      classes = classes.filter((c) => {
        if (c.timeSlots) {
          const foundFittingTimeSlots = c.timeSlots.find((ts) => {
            return !ts.isBooked && dayjs(ts.date).format('DD/MM/YYYY') === date.format('DD/MM/YYYY');
          });
          return foundFittingTimeSlots ? true : false;
        } else {
          return false;
        }
      });
    }

    // Apply Capacity Filter
    if (guests) {
      classes = classes.filter((c) => {
        return c.maxGuests >= guests && c.minGuests <= guests;
      });
    }

    // Apply Price Filter
    if (priceLow || priceUp) {
      classes = classes.filter((c) => {
        if (priceUp && c.pricePerPerson > priceUp) {
          return false;
        } else if (priceLow && c.pricePerPerson < priceLow) {
          return false;
        }
        return true;
      });
    }

    // Apply Rating Filter
    if (rating) {
      classes = classes.filter((c) => c.avgRating >= rating);
    }

    // Apply Dietary Preferences Filters
    if (vegan) {
      classes = classes.filter((c) => c.veganFriendly);
    }

    if (vegetarian) {
      classes = classes.filter((c) => c.vegetarianFriendly);
    }

    if (nutAllergy) {
      classes = classes.filter((c) => c.nutAllergyFriendly);
    }

    if (pescatarian) {
      classes = classes.filter((c) => c.pescatarianFriendly);
    }

    if (eggFree) {
      classes = classes.filter((c) => c.eggFree);
    }

    if (soyFree) {
      classes = classes.filter((c) => c.soyFree);
    }

    // if the user is logged in we want to show only the classes where he/she fulfills the minimum rating requirement
    if (req.user && req.user.avgRatingAsGuest) {
      classes = classes.filter((c) => {
        if (!c.minGuestRatingRequired) {
          return true;
          // a user needs to be reviewed at least 5 timees before his avg rating is taken into account
        } else if (req.user.feedbacksAsGuests && req.user.feedbacksAsGuests.length < 4) {
          return true;
        } else {
          return c.minGuestRatingRequired <= req.user.avgRatingAsGuest;
        }
      });
    }
    const numberOfEntries = classes.length;
    // Apply Skip and Limit
    if (skip !== undefined && limit !== undefined) {
      classes = classes.slice(skip, skip + limit);
    }

    res.json({
      numberOfEntries,
      classes: classes.map((c) => {
        return c.toJSON();
      }),
    });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { hostId } = req.query;
    let classes = [];

    if (hostId) {
      // classes by the specified host
      classes = await Class.find({ host: new ObjectId(hostId) }).populate('host');
    } else {
      classes = await Class.find().populate('host');
    }
    res.json({
      classes: classes.map((c) => {
        return JSON.parse(JSON.stringify(c));
      }),
    });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during class search.' });
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const c = await Class.findById(req.params.id).populate('host').populate({ path: 'feedbacks.reviewer' });
    if (!c) return res.status(404).json({ message: 'No class found.' });
    res.json({ class: c.toJSON() });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }
});

// need this for the edit form --> the host can see all the fields of the class including private information
router.get('/:id/ashost', [requireJwtAuth], async (req, res) => {
  try {
    const c = await Class.findById(req.params.id).populate('host').populate({ path: 'feedbacks.reviewer' });

    // check that the user making the request is the host of the class or an admin
    if (!(c.host.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({ message: 'Only the host of a class can see all information of the class!' });
    }

    if (!c) return res.status(404).json({ message: 'No class found.' });
    const returnedClass = c.toJSON();
    returnedClass.privateInformation = c.privateInformation;
    res.json({ class: returnedClass });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
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
    const timeSlots = Array.from([...tempClass.timeSlots]).map((v) => v.toJSON());
    let containsBookedTimeSlot = false;
    timeSlots.forEach((timeSlot) => {
      if (timeSlot.isBooked) {
        containsBookedTimeSlot = true;
      }
    });
    if (containsBookedTimeSlot) {
      res.status(500).json({ message: 'You can not delete a class that has already been booked!' });
    } else {
      const c = await Class.findByIdAndDelete(tempClass._id);
      res.status(200).json({ c });
    }
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
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
      lon: req.body.lon,
      lat: req.body.lat,
      meetingAddress: req.body.meetingAddress,
      pricePerPerson: req.body.pricePerPerson,
      durationInMinutes: req.body.durationInMinutes,
      minGuests: req.body.minGuests,
      maxGuests: req.body.maxGuests,
      minGuestRatingRequired: req.body.minGuestRatingRequired,
      veganFriendly: req.body.veganFriendly,
      vegetarianFriendly: req.body.vegetarianFriendly,
      nutAllergyFriendly: req.body.nutAllergyFriendly,
      pescatarianFriendly: req.body.pescatarianFriendly,
      eggFree: req.body.vegetarianFriendly,
      soyFree: req.body.nutAllergyFriendly,
      privateInformation: req.body.privateInformation,
    };

    Object.keys(updatedClass).forEach((key) => (updatedClass[key] === undefined ? delete updatedClass[key] : {}));

    const c = await Class.findByIdAndUpdate(tempClass._id, { $set: updatedClass }, { new: true });

    res.status(200).json({ c });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
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
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }
});

router.post('/:classId/feedbacks/:orderId', [requireJwtAuth], async (req, res, next) => {
  try {
    // check that class exists in database
    const tempClass = await Class.findById(req.params.classId).populate('host');
    if (!tempClass) {
      return res.status(404).json({ message: 'Class not found!' });
    }
    // check that order exists in database
    const order = await Order.findById(req.params.orderId).populate('customer').populate('class');
    if (!order) {
      return res.status(404).json({ message: 'Order not found!' });
    }
    // check that classId and orderId
    if (order.class.id !== tempClass.id) {
      return res.status(500).json({ message: 'OrderId does not match Class ID!' });
    }
    // now we check that the class has already happened, thus is in the past
    if (dayjs(order.bookedTimeSlot.date).isAfter(dayjs())) {
      return res
        .status(500)
        .json({ message: 'The class is upcoming, you can only review classes that already happened!' });
    }
    // now we check that the logged in user is the customer who booked the class
    const idOfLoggedInUser = req.user.id;
    if (order.customer.id !== idOfLoggedInUser) {
      return res.status(401).json({ message: 'You can only review your own classes!' });
    }
    // now we check that the order is not already reviewed
    if (order.reviewedByCustomer) {
      return res.status(500).json({ message: 'You already reviewed this order' });
    }

    const newFeedback = {
      overallRating: req.body.overallRating,
      overallRatingStars: req.body.overallRatingStars,
      hostRatingStars: req.body.hostRatingStars,
      tasteRatingStars: req.body.tasteRatingStars,
      locationRatingStars: req.body.locationRatingStars,
      vtmrRatingStars: req.body.vtmrRatingStars,
      experienceRatingStars: req.body.experienceRatingStars,
      reviewer: req.user.id,
      feedbackDate: dayjs().utc().toJSON(),
    };

    const { error } = validateFeedback(newFeedback);
    if (error) return res.status(400).json({ message: error.details[0].message });
    tempClass.feedbacks.push(newFeedback);
    let updatedClass = {
      feedbacks: tempClass.feedbacks,
    };
    //update Class Feedback Ratings
    updatedClass.avgRating =
      tempClass.feedbacks.map((f) => f.overallRatingStars).reduce((a, b) => a + b) / tempClass.feedbacks.length;
    updatedClass.hostRating =
      tempClass.feedbacks.map((f) => f.hostRatingStars).reduce((a, b) => a + b) / tempClass.feedbacks.length;
    updatedClass.tasteRating =
      tempClass.feedbacks.map((f) => f.tasteRatingStars).reduce((a, b) => a + b) / tempClass.feedbacks.length;
    updatedClass.locationRating =
      tempClass.feedbacks.map((f) => f.locationRatingStars).reduce((a, b) => a + b) / tempClass.feedbacks.length;
    updatedClass.vtmrRating =
      tempClass.feedbacks.map((f) => f.vtmrRatingStars).reduce((a, b) => a + b) / tempClass.feedbacks.length;
    updatedClass.expRating =
      tempClass.feedbacks.map((f) => f.experienceRatingStars).reduce((a, b) => a + b) / tempClass.feedbacks.length;
    updatedClass = await Class.findByIdAndUpdate(tempClass._id, { $set: updatedClass }, { new: true });
    await Order.findByIdAndUpdate(req.params.orderId, { $set: { reviewedByCustomer: true } }, { new: true });

    res.status(200).json({ updatedClass });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
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
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
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
    lon: req.body.lon,
    lat: req.body.lat,
    minGuestRatingRequired: req.body.minGuestRatingRequired ? Number(req.body.minGuestRatingRequired) : 0,
    meetingAddress: req.body.meetingAddress,
    pricePerPerson: req.body.pricePerPerson,
    durationInMinutes: req.body.durationInMinutes,
    minGuests: req.body.minGuests,
    maxGuests: req.body.maxGuests,
    veganFriendly: req.body.veganFriendly,
    vegetarianFriendly: req.body.vegetarianFriendly,
    nutAllergyFriendly: req.body.nutAllergyFriendly,
    pescatarianFriendly: req.body.pescatarianFriendly,
    eggFree: req.body.eggFree,
    soyFree: req.body.soyFree,
    privateInformation: req.body.privateInformation,
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
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the class creation.' });
    }
  }
});

export default router;
