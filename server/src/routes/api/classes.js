import { Router } from 'express';
import { Model } from 'mongoose';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import dayjs from 'dayjs';
import multer from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';
import mime from 'mime';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Class, { validateClass } from '../../models/Class';

const router = Router();

// Note : __dirname is an node js environment variable that
// tells you the absolute path of the directory
// containing the currently executing file.
const storage = multer.diskStorage({
  // tells multer where to store the uploaded images
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '../../../public/images'));
  },
  // tells multer what names the uploaded images should have
  filename: function (req, file, cb) {
    const extension = mime.getExtension(file.mimetype);
    crypto.randomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + extension);
    });
  },
});

const upload = multer({
  storage,
  // 5000000 bytes = 5 megabytes
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    // only png jpg or jpeg are allowed, we determine this by the mimetype
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true); // accept file
    } else {
      cb(null, false); // reject file
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

router.get('/', async (req, res, next) => {
  try {
    const classes = await Class.find().populate('host');
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

router.post('/', [requireJwtAuth, upload.array('photos[]', 3)], async (req, res, next) => {
  req.body.bookableDates = JSON.parse(req.body.bookableDates);
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
    host: req.user.id, // added by authentication middleware to request --> frontend does not need to send it
    bookableDates: req.body.bookableDates.map((date) => dayjs(date).utc().toDate()),
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

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const cl = await Class.findById(req.params.id);
    if (!cl) return res.status(404).json({ message: 'No such class.' });
    if(!(cl.host.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privilegies to delete that class.' })
    const classToDelete = await Class.findByIdAndRemove(cl.id);
    res.status(200).json({ classToDelete });
  } catch (err) {
    if(res.status === 500) res.status(500).json({ message: 'Something went wrong.' });
    else if(res.status === 204) res.status(204).json({ message: 'Class successfully removed'});
}
});

export default router;
