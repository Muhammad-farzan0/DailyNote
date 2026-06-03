import express from 'express';
import {
  createCard,
  moveCard,
  setTimer,
  updateCard,
  addComment,
  deleteCard
} from '../controllers/cardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/', createCard);
router.put('/move', moveCard);
router.put('/:cardId/timer', setTimer);
router.put('/:cardId', updateCard);
router.post('/:cardId/comments', addComment);
router.delete('/:cardId', deleteCard);

export default router;