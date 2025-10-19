import express from 'express';
import { protect } from '../middleware/middleware.js';
import FamilyMember from '../model/FamilyMember.js';

const router = express.Router();

router.post('/', protect, async (req, res, next) => {
  try {
    const { name, relationship, dob, notes } = req.body;
    if (!name || !relationship) {
      return res.status(400).json({ message: 'Name and relationship are required' });
    }

    const member = new FamilyMember({
      user: req.user._id,
      name,
      relationship,
      dob,
      notes,
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    next(error); // Error ko errorHandler pe bhej dega
  }
});

// GET /api/v1/family - Apne saare family members ko fetch karein
router.get('/', protect, async (req, res, next) => {
  try {
    const members = await FamilyMember.find({ user: req.user._id });
    res.json(members);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/family/:id - Member ki details update karein
router.put('/:id', protect, async (req, res, next) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    // Check karein ke member user ka hi hai
    if (member.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
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

// DELETE /api/v1/family/:id - Member ko delete karein
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    if (member.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await member.deleteOne();
    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
});

export default router;