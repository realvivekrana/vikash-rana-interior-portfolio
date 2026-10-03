import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const base = file.originalname
      .replace(/\.pdf$/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'document';
    return {
      folder: 'vikash-portfolio/docs',
      resource_type: 'raw', // PDF ko raw file ki tarah rakhte hain
      public_id: `${base}-${Date.now()}.pdf`, // raw files mein extension public_id ka hissa hota hai
    };
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB (Cloudinary free plan ki raw limit bhi yehi hai)
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('Only PDF files are allowed'));
  },
});

// Multer ke errors ko 400 banata hai (warna 500 jaata)
const uploadPdf = (field = 'file') => (req, res, next) =>
  uploader.single(field)(req, res, (err) => {
    if (!err) return next();
    res.status(400);
    next(err.code === 'LIMIT_FILE_SIZE' ? new Error('PDF must be smaller than 10 MB') : err);
  });

export default uploadPdf;