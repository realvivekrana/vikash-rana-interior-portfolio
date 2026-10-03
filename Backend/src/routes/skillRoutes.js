import { Router } from 'express';
import { getSkills, getSkillsAdmin, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/admin/all', protect, getSkillsAdmin);
router.get('/', getSkills);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;