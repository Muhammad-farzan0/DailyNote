import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Search users by email (partial match)
router.get('/search', protect, async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email || email.length < 2) {
      return res.json([]);
    }
    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id }
    })
    .limit(5)
    .select('_id name email avatar');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;