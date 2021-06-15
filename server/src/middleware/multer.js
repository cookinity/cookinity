import multer from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';
import mime from 'mime';

// Note : __dirname is an node js environment variable that
// tells you the absolute path of the directory
// containing the currently executing file.
const storage = multer.diskStorage({
  // tells multer where to store the uploaded images
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '../../public/images'));
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

export default upload;
