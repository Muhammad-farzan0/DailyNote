import express from 'express';
import { uploadAttachment, deleteAttachment } from '../controllers/attachmentController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.use(protect);

router.post('/cards/:cardId/attachments', upload.single('file'), uploadAttachment);
router.delete('/cards/:cardId/attachments/:publicId', deleteAttachment);

export default router;