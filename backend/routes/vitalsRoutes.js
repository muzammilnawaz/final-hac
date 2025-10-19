import express from 'express';
import Vital from '../model/Vital.js'; // Verify path
import { protect } from '../middleware/middleware.js'; // Verify path

const router = express.Router();

// POST /api/v1/vitals (Add new vital)
router.post('/', protect, async (req, res, next) => { // Path is '/'
  const { bp, sugar, weight, notes, memberId } = req.body;
  try {
    const vital = new Vital({
      user: req.user._id,
      bp,
      sugar: sugar ? Number(sugar) : undefined,
      weight: weight ? Number(weight) : undefined,
      notes,
      member: memberId || undefined,
    });
    const createdVital = await vital.save();
    res.status(201).json(createdVital);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vitals (Get all vitals, filtered)
router.get('/', protect, async (req, res, next) => { // Path is '/'
  try {
    const filter = { user: req.user._id };
    if (req.query.memberId) filter.member = req.query.memberId;
    if (req.query.self === 'true') filter.member = { $exists: false };
    const vitals = await Vital.find(filter).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vitals/:id (Get single vital entry)
router.get('/:id', protect, async (req, res, next) => { // Path is '/:id'
    try {
        const vital = await Vital.findOne({ _id: req.params.id, user: req.user._id });
        if (!vital) {
            const err = new Error('Vital entry not found');
            err.status = 404;
            return next(err);
        }
        res.json(vital);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/v1/vitals/:id (Delete a vital entry)
router.delete('/:id', protect, async (req, res, next) => { // Path is '/:id'
  try {
    const vital = await Vital.findById(req.params.id);
    if (!vital) {
       const err = new Error('Vital entry not found');
       err.status = 404;
       return next(err);
    }
    if (vital.user.toString() !== req.user._id.toString()) {
       const err = new Error('User not authorized');
       err.status = 401;
       return next(err);
    }
    await vital.deleteOne();
    res.json({ message: 'Vital entry removed' });
  } catch (error) {
    next(error);
  }
});

export default router;