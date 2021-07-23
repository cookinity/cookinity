import { Router } from 'express';

const nodemailer = require('nodemailer');
const router = Router();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully signed into Gmail account');
  }
});

router.post('/', (req, res, next) => {
  const mail = {
    to: 'cookinity@gmail.com',
    subject: 'Cookinity Question Form Submission',
    html: `${req.body.message}` + '<br><br>Send by <br>' + `${req.body.name}` + '<br/>' + `${req.body.email}`,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail',
      });
    } else {
      res.json({
        status: 'success',
      });
    }
  });
});

export default router;
