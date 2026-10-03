import cloudinary from '../config/cloudinary.js';

const deleteImage = async (public_id) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};

export default deleteImage;