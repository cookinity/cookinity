import { Router } from 'express';
import upload from '../../middleware/multer';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import User, { hashPassword, validateUser } from '../../models/User';
import { validateFeedback } from '../../models/FeedbackHost';

const router = Router();

router.post('/:id/feedback-guests', [requireJwtAuth], async (req, res, next) => {
  try {
    //Check that Guest exists
    const tempUser = await User.findById(req.params.id);
    if (!tempUser) return res.status(404).json({ message: 'No such user.' });
    //Reviewer
    const reviewerId = req.user.id;
    //ToDo: Validate that User is allowed to give Feedback

    const newGuestFeedback = {
      numberOfStars: req.body.numberOfStars,
      reviewer: reviewerId,
    };

    //Validate feedback
    const { error } = validateFeedback(newGuestFeedback);
    if (error) return res.status(400).json({ message: error.details[0].message });

    //save
    tempUser.feedbacksAsGuests.push(newGuestFeedback);
    let updatedUser = {
      feedbacksAsGuests: tempUser.feedbacksAsGuests,
    };

    //update Average Rating
    updatedUser.avgRatingAsGuest =
      tempUser.feedbacksAsGuests.map((f) => f.numberOfStars).reduce((a, b) => a + b) /
      tempUser.feedbacksAsGuests.length;
    updatedUser = await User.findByIdAndUpdate(tempUser._id, { $set: updatedUser }, { new: true });
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
