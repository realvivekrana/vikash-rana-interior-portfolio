import { Router } from 'express';
import { trackVisit } from '../controllers/activityController.js';
import { trackLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/', trackLimiter, trackVisit);

export default router;