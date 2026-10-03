import { Router } from 'express';
import {
  getTestimonials, getTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/admin/all', protect, getTestimonialsAdmin);
router.get('/', getTestimonials);
router.post('/', protect, upload.single('image'), createTestimonial);
router.put('/:id', protect, upload.single('image'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;