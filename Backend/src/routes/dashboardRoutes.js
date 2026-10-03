import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', protect, getStats);

export default router;