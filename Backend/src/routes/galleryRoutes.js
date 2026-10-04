import { Router } from 'express';
import {
  getGallery, getGalleryCategories, getGalleryAdmin,
  createGalleryItems, updateGalleryItem, deleteGalleryItem, deleteManyGallery,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();

// Multer ke errors (badi file, galat format) ko 400 banata hai, warna 500 jaata
const handleUpload = (mw) => (req, res, next) =>
  mw(req, res, (err) => {
    if (!err) return next();
    res.status(400);
    next(err.code === 'LIMIT_FILE_SIZE' ? new Error('Each image must be smaller than 8 MB') : err);
  });

// Admin (static paths pehle)
router.get('/admin/all', protect, getGalleryAdmin);
router.delete('/', protect, deleteManyGallery);
router.post('/', protect, handleUpload(upload.array('images', 20)), createGalleryItems);
router.put('/:id', protect, handleUpload(upload.single('image')), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

// Public
router.get('/categories', getGalleryCategories);
router.get('/', getGallery);

export default router;