import { Router } from 'express';
import Hero from '../models/Hero.js';
import makeSingletonController from '../controllers/singletonController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();
const ctrl = makeSingletonController(Hero, ['backgroundImage'], ['eyebrow', 'heading', 'subheading', 'ctaText', 'ctaLink']);

router.get('/', ctrl.get);
router.put('/', protect, upload.fields([{ name: 'backgroundImage', maxCount: 1 }]), ctrl.update);

export default router;