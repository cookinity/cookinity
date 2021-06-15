import { Router } from 'express';
import { Model } from 'mongoose';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Class, { validateClass } from '../../models/Class';

const router = Router();

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

router.post('/', requireJwtAuth, async (req, res, next) => {
  const { error } = validateClass(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let newClass = await Class.create({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      meetingAddress: req.body.meetingAddress,
      host: req.user.id, // added by authentication middleware to request --> frontend does not need to send it
    });
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
