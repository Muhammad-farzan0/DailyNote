import express from 'express';
import { createList, updateList, deleteList } from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);   // <-- make sure this exists

export default router;