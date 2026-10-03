import { Router } from 'express';
import { createMessage, getMessages, toggleRead, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createMessage);
router.get('/', protect, getMessages);
router.patch('/:id/read', protect, toggleRead);
router.delete('/:id', protect, deleteMessage);

export default router;