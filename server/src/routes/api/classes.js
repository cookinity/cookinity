import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Class, { validateClass } from '../../models/Class';
import upload from '../../middleware/multer';
var ObjectId = require('mongoose').Types.ObjectId;

const router = Router();

var photosUpload = upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photoOne', maxCount: 1 },
  { name: 'photoTwo', maxCount: 1 },
]);

router.get('/', async (req, res, next) => {
  try {
    const limitValue = parseInt(req.query.limit);
    const skipValue = parseInt(req.query.skip);
    
    if (skipValue < 0) return res.status(400).json({message: 'This is already the most previous page'})

    const { hostId, category, city, date } = req.query;
    let classes = [];

    if (hostId) {
      // classes by the specified host
      classes = await Class.find({host: new ObjectId(hostId)}).populate('host').skip(skipValue).limit(limitValue)
    }  
    else if (category) {
     classes = await Class.find({category: category.toString()}).skip(skipValue).limit(limitValue)
    }  else if (city) {
      classes = await Class.find({'meetingAddress.city': city.toString()}).skip(skipValue).limit(limitValue)
    }  else if (date) {
      classes = await Class.find({ date : { $all: ['bookableDates']} }).skip(skipValue).limit(limitValue)
    } else {
      // all classes
      //classes = await Class.aggregate([{ $match: {
      //  category : category,
      //  'meetingAddress.city' : city,
      //  date: { $all: ['bookableDates']}
      //  }}, {$limit : limitValue}, {$skip: skipValue}])
      classes = await Class.find().populate('host').skip(skipValue).limit(limitValue);
    }

    res.json({
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

router.get('/:id', async (req, res) => {
  try {
    const c = await Class.findById(req.params.id).populate('host');
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

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const cl = await Class.findById(req.params.id).populate('host');
    if (!cl) return res.status(404).json({ message: 'No such class.' });
    if (!(cl.host.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privilegies to delete that class.' });
    const classToDelete = await Class.findByIdAndRemove(cl.id);
    res.status(200).json({ classToDelete });
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
    if (!(tempClass.host.id === req.user.id) || req.user.role === 'ADMIN') {
      return res.status(400).json({ message: 'Only the host of a class can edit a class!' });
    }

    // modifying the request body
    if (req.body.bookableDates) {
      req.body.bookableDates = JSON.parse(req.body.bookableDates);
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
      bookableDates: req.body.bookableDates
        ? req.body.bookableDates.map((date) => dayjs(date).utc().toDate())
        : undefined,
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

router.post('/', [requireJwtAuth, photosUpload], async (req, res, next) => {
  if (req.body.bookableDates) {
    req.body.bookableDates = JSON.parse(req.body.bookableDates);
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
    bookableDates: req.body.bookableDates
      ? req.body.bookableDates.map((date) => dayjs(date).utc().toDate())
      : undefined,
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
