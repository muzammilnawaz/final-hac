import express from 'express';
import Vital from '../model/Vital.js'; // Aapka path theek hai
import { protect } from '../middleware/middleware.js'; // Aapka path theek hai

const router = express.Router();

// POST /api/v1/vitals (Add new vital for user or member)
router.post('/', protect, async (req, res, next) => {
  // memberId ko body se nikalein
  const { bp, sugar, weight, notes, memberId } = req.body;
  try {
    const vital = new Vital({
      user: req.user._id,
      bp,
      sugar,
      weight,
      notes,
      member: memberId, // Yahan memberId add karein
    });
    const createdVital = await vital.save();
    res.status(201).json(createdVital);
  } catch (error) {
    next(error); // Error ko central error handler ke paas bhejein
  }
});

// GET /api/v1/vitals (Get all vitals for user)
// Aap isko filter bhi kar sakte hain, e.g., /api/v1/vitals?memberId=...
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    
    // Agar query mein memberId hai, tou sirf us member ke vitals bhejein
    if (req.query.memberId) {
      filter.member = req.query.memberId;
    }

    const vitals = await Vital.find(filter).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (error) {
    next(error); // Error ko central error handler ke paas bhejein
  }
});

// DELETE /api/v1/vitals/:id (Delete a vital entry)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const vital = await Vital.findById(req.params.id);

    if (!vital) {
      res.status(404);
      throw new Error('Vital entry not found');
    }

    // Check karein ke yeh vital usi user ka hai
    if (vital.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await vital.deleteOne();
    res.json({ message: 'Vital entry removed' });
  } catch (error) {
    next(error); // Error ko central error handler ke paas bhejein
  }
});

export default router;