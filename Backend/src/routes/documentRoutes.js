import { Router } from 'express';
import {
  getDocuments, getPrimaryResume, getDocumentsAdmin,
  createDocument, updateDocument, deleteDocument, serveFile,
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import uploadPdf from '../middleware/uploadPdf.js';

const router = Router();

// Admin (static paths pehle)
router.get('/admin/all', protect, getDocumentsAdmin);
router.post('/', protect, uploadPdf('file'), createDocument);
router.put('/:id', protect, uploadPdf('file'), updateDocument);
router.delete('/:id', protect, deleteDocument);

// Public
router.get('/resume', getPrimaryResume);
router.get('/', getDocuments);
router.get('/:id/file', serveFile);

export default router;