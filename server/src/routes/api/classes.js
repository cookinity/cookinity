import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Class, { validateClass } from '../../models/Class';
import upload from '../../middleware/multer';
var ObjectId = require('mongoose').Types.ObjectId;

const router = Router();

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

router.put('/:id', [requireJwtAuth, upload.array('photos[]', 3)], async (req, res, next) => {
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
    // cover photo is at position 0
    // photo one is at position 1
    // photo two is at position 2
    if (req.files) {
      if (req.files[0]) {
        coverPhoto = req.files[0].filename;
      }
      if (req.files[1]) {
        photoOne = req.files[1].filename;
      }
      if (req.files[2]) {
        photoTwo = req.files[2].filename;
      }
    }

    const updatedClass = {
      title: req.body.title,
      coverPhoto: coverPhoto,
      photoOne: photoOne,
      photoTwo: photoTwo,
      category: req.body.category,
      description: req.body.description,
      meetingAddress: req.body.meetingAddress,
      pricePerPerson: req.body.pricePerPerson,
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
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', [requireJwtAuth, upload.array('photos[]', 3)], async (req, res, next) => {
  if (req.body.bookableDates) {
    req.body.bookableDates = JSON.parse(req.body.bookableDates);
  }
  let coverPhoto = undefined;
  let photoOne = undefined;
  let photoTwo = undefined;
  // cover photo is at position 0
  // photo one is at position 1
  // photo two is at position 2
  if (req.files) {
    if (req.files[0]) {
      coverPhoto = req.files[0].filename;
    }
    if (req.files[1]) {
      photoOne = req.files[1].filename;
    }
    if (req.files[2]) {
      photoTwo = req.files[2].filename;
    }
  }

  const c = {
    title: req.body.title,
    coverPhoto: coverPhoto,
    photoOne: photoOne,
    photoTwo: photoTwo,
    category: req.body.category,
    description: req.body.description,
    meetingAddress: req.body.meetingAddress,
    pricePerPerson: Number(req.body.pricePerPerson),
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
    res.status(500).json({ message: 'Something went wrong during the class creation.' });
  }
});

export default router;
