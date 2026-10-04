import { Router } from 'express';
import { generate } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();
router.post('/generate', aiLimiter, generate);

export default router;