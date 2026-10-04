import { Router } from 'express';
import { getAiTools, getAiToolsAdmin, createAiTool, updateAiTool, deleteAiTool } from '../controllers/aiToolController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/admin/all', protect, getAiToolsAdmin);
router.get('/', getAiTools);
router.post('/', protect, createAiTool);
router.put('/:id', protect, updateAiTool);
router.delete('/:id', protect, deleteAiTool);

export default router;