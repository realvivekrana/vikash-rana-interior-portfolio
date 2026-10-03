import { Router } from 'express';
import About from '../models/About.js';
import makeSingletonController from '../controllers/singletonController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();
const ctrl = makeSingletonController(About, ['photo'], ['name', 'title', 'bio', 'stats']);

router.get('/', ctrl.get);
router.put('/', protect, upload.fields([{ name: 'photo', maxCount: 1 }]), ctrl.update);

export default router;