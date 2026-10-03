import Testimonial from '../models/Testimonial.js';
import deleteImage from '../utils/deleteImage.js';

export const getTestimonials = async (req, res) => {
  const data = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, data });
};

export const getTestimonialsAdmin = async (req, res) => {
  const data = await Testimonial.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

export const createTestimonial = async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.image = { url: req.file.path, public_id: req.file.filename };
  const data = await Testimonial.create(body);
  res.status(201).json({ success: true, data });
};

export const updateTestimonial = async (req, res) => {
  const item = await Testimonial.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  Object.assign(item, req.body);
  if (req.file) {
    await deleteImage(item.image?.public_id);
    item.image = { url: req.file.path, public_id: req.file.filename };
  }
  await item.save();
  res.json({ success: true, data: item });
};

export const deleteTestimonial = async (req, res) => {
  const item = await Testimonial.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  await deleteImage(item.image?.public_id);
  await item.deleteOne();
  res.json({ success: true, message: 'Testimonial deleted' });
};