import express from 'express';
import { generateDescription, suggestDeadline } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/generate-description', generateDescription);
router.post('/suggest-deadline', suggestDeadline);
export default router;