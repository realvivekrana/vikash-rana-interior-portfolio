import { Router } from 'express';
import {
  getProjects, getProjectBySlug, getCategories,
  getAllProjectsAdmin, getProjectById,
  createProject, updateProject, deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();
const projectUpload = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 20 },
]);

// Admin (static paths pehle, taaki /:slug se na takraye)
router.get('/admin/all', protect, getAllProjectsAdmin);
router.get('/admin/:id', protect, getProjectById);
router.post('/', protect, projectUpload, createProject);
router.put('/:id', protect, projectUpload, updateProject);
router.delete('/:id', protect, deleteProject);

// Public
router.get('/categories', getCategories);
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

export default router;