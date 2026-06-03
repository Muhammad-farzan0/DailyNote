import express from 'express';
import { getBoardActivities } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/board/:boardId', getBoardActivities);
export default router;