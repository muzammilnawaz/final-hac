import express from 'express';
import { protect } from '../middleware/middleware.js'; // Verify path
import FamilyMember from '../model/FamilyMember.js'; // Verify path

const router = express.Router();

// POST /api/v1/family (Add new family member)
router.post('/', protect, async (req, res, next) => { // Path is '/'
  try {
    const { name, relationship, dob, notes } = req.body;
    if (!name || !relationship) {
      const err = new Error('Name and relationship are required');
      err.status = 400;
      return next(err);
    }
    const member = new FamilyMember({
      user: req.user._id, name, relationship, dob, notes,
    });
    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/family (Get all family members)
router.get('/', protect, async (req, res, next) => { // Path is '/'
  try {
    const members = await FamilyMember.find({ user: req.user._id });
    res.json(members);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/family/:id (Get single family member)
router.get('/:id', protect, async (req, res, next) => { // Path is '/:id'
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, user: req.user._id });
    if (!member) {
       const err = new Error('Member not found');
       err.status = 404;
       return next(err);
    }
    res.json(member);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/family/:id (Update family member)
router.put('/:id', protect, async (req, res, next) => { // Path is '/:id'
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) {
       const err = new Error('Member not found');
       err.status = 404;
       return next(err);
    }
    if (member.user.toString() !== req.user._id.toString()) {
       const err = new Error('Not authorized');
       err.status = 401;
       return next(err);
    }
    member.name = req.body.name || member.name;
    member.relationship = req.body.relationship || member.relationship;
    member.dob = req.body.dob || member.dob;
    member.notes = req.body.notes || member.notes;
    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/family/:id (Delete family member)
router.delete('/:id', protect, async (req, res, next) => { // Path is '/:id'
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) {
       const err = new Error('Member not found');
       err.status = 404;
       return next(err);
    }
    if (member.user.toString() !== req.user._id.toString()) {
       const err = new Error('Not authorized');
       err.status = 401;
       return next(err);
    }
    await member.deleteOne();
    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
});

export default router;