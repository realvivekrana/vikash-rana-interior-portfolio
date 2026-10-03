import { Router } from 'express';
import { createMessage, getMessages, toggleRead, deleteMessage, markAllRead } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { contactLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/', contactLimiter, createMessage);
router.get('/', protect, getMessages);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, toggleRead);
router.delete('/:id', protect, deleteMessage);

export default router;