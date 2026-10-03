import { Router } from 'express';
import Settings from '../models/Settings.js';
import makeSingletonController from '../controllers/singletonController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();
const ctrl = makeSingletonController(Settings, ['logo']);

router.get('/', ctrl.get);
router.put('/', protect, upload.fields([{ name: 'logo', maxCount: 1 }]), ctrl.update);

export default router;