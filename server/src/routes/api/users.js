import { Router } from 'express';
import upload from '../../middleware/multer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, validateUser } from '../../models/User';
import Order from '../../models/Order';
import { validateFeedback } from '../../models/FeedbackHost';

const router = Router();

router.post('/:orderId/feedback-for-guests', [requireJwtAuth], async (req, res, next) => {
  try {
    // check that order exists in database
    const order = await Order.findById(req.params.orderId).populate('customer').populate('host');
    if (!order) {
      return res.status(404).json({ message: 'Order not found!' });
    }
    // check that the user making the request is the host of the class
    const idOfLoggedInUser = req.user.id;
    if (idOfLoggedInUser !== order.host.id) {
      return res.status(401).json({ message: 'You must be the host of the class to give reviews to guests' });
    }
    // now we check that the class has already happened, thus is in the past
    if (dayjs(order.bookedTimeSlot.date).isAfter(dayjs())) {
      return res
        .status(500)
        .json({ message: 'The class is upcoming, you can only review guests for classes that already happened!' });
    }
    // now we check that the order is not already reviewed
    if (order.reviewedByHost) {
      return res.status(500).json({ message: 'You already reviewed the guest for this order!' });
    }

    const guest = await User.findById(order.customer.id);

    const newGuestFeedback = {
      numberOfStars: req.body.numberOfStars,
      reviewer: idOfLoggedInUser,
    };

    //Validate feedback
    const { error } = validateFeedback(newGuestFeedback);
    if (error) return res.status(400).json({ message: error.details[0].message });

    //save
    guest.feedbacksAsGuests.push(newGuestFeedback);
    let updatedUser = {
      feedbacksAsGuests: guest.feedbacksAsGuests,
    };

    //update Average Rating
    updatedUser.avgRatingAsGuest =
      guest.feedbacksAsGuests.map((f) => f.numberOfStars).reduce((a, b) => a + b) / guest.feedbacksAsGuests.length;
    updatedUser = await User.findByIdAndUpdate(guest._id, { $set: updatedUser }, { new: true });
    await Order.findByIdAndUpdate(order._id, { $set: { reviewedByHost: true } }, { new: true });

    res.status(200).json({ updatedUser });
  } catch (err) {
    if (err.message) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong during the feedback creation of the customer.' });
    }
  }
});

router.put('/:id', [requireJwtAuth, upload.single('avatar')], async (req, res, next) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privilegies to edit this user.' });

    //validate name, username and password
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    let avatarPath = null;
    if (req.file) {
      avatarPath = req.file.filename;
    }

    let password = null;
    if (req.user.provider === 'email' && req.body.password && req.body.password !== '') {
      password = await hashPassword(req.body.password);
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.id !== tempUser.id) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const updatedUser = {
      avatar: avatarPath,
      name: req.body.name,
      username: req.body.username,
      password,
      description: req.body.description,
    };
    Object.keys(updatedUser).forEach((k) => !updatedUser[k] && updatedUser[k] !== undefined && delete updatedUser[k]);
    const user = await User.findByIdAndUpdate(tempUser.id, { $set: updatedUser }, { new: true });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/me', requireJwtAuth, (req, res) => {
  const me = req.user.toJSON();
  res.json({ me });
});

router.get('/:username', requireJwtAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'No user found.' });
    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/', requireJwtAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 'desc' });

    res.json({
      users: users.map((m) => {
        return m.toJSON();
      }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    if (!(tempUser.id === req.user.id || req.user.role === 'ADMIN'))
      return res.status(400).json({ message: 'You do not have privilegies to delete that user.' });

    //delete user
    const user = await User.findByIdAndRemove(tempUser.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
