import { Router } from 'express';
import {
  getServices, getServicesAdmin, createService, updateService, deleteService,
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/admin/all', protect, getServicesAdmin);
router.get('/', getServices);
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

export default router;