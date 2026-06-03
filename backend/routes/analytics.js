import express from 'express';
import { getBoardAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/board/:boardId', getBoardAnalytics);
export default router;