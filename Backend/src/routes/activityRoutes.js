import { Router } from 'express';
import { getOverview, getLogs } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/overview', protect, getOverview);
router.get('/logs', protect, getLogs);

export default router;