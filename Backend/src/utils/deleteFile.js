import cloudinary from '../config/cloudinary.js';

// PDF/documents Cloudinary par "raw" resource hote hain (images se alag)
const deleteFile = async (public_id) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type: 'raw' });
  } catch (err) {
    console.error('Cloudinary file delete failed:', err.message);
  }
};

export default deleteFile;