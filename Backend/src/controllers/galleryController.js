import mongoose from 'mongoose';
import GalleryItem from '../models/GalleryItem.js';
import deleteImage from '../utils/deleteImage.js';
import pick from '../utils/pick.js';

const FIELDS = ['title', 'category', 'featured', 'isPublished', 'order'];
const SORT = { order: 1, createdAt: -1, _id: -1 };

const toImage = (file) => ({ url: file.path, public_id: file.filename });

// PUBLIC
export const getGallery = async (req, res) => {
  const { category, featured } = req.query;
  const filter = { isPublished: true };
  if (category && category !== 'All') filter.category = category;
  if (featured === 'true') filter.featured = true;

  const data = await GalleryItem.find(filter).sort(SORT);
  res.json({ success: true, count: data.length, data });
};

export const getGalleryCategories = async (req, res) => {
  const data = await GalleryItem.distinct('category', { isPublished: true });
  res.json({ success: true, data });
};

// ADMIN
export const getGalleryAdmin = async (req, res) => {
  const data = await GalleryItem.find().sort(SORT);
  res.json({ success: true, count: data.length, data });
};

// Ek saath kai photos upload (field: images). Har photo ka alag item banta hai.
export const createGalleryItems = async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    res.status(400);
    throw new Error('Please choose at least one image');
  }

  const base = pick(req.body, ['featured', 'isPublished']);
  base.category = (req.body.category || '').trim() || 'General';
  base.order = Number(req.body.order) || 0;

  const docs = files.map((f) => ({
    ...base,
    // title sirf tab jab ek hi photo ho (kai photos par same title ajeeb lagta)
    title: files.length === 1 ? (req.body.title || '').trim() : '',
    image: toImage(f),
  }));

  try {
    const data = await GalleryItem.insertMany(docs);
    res.status(201).json({ success: true, count: data.length, data });
  } catch (err) {
    // Save fail hua to upload ho chuki images Cloudinary se hata do
    for (const f of files) await deleteImage(f.filename);
    throw err;
  }
};

export const updateGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    if (req.file) await deleteImage(req.file.filename);
    res.status(404);
    throw new Error('Gallery photo not found');
  }

  Object.assign(item, pick(req.body, FIELDS));
  if (typeof item.category === 'string' && !item.category.trim()) item.category = 'General';

  const oldId = item.image?.public_id;
  if (req.file) item.image = toImage(req.file);

  try {
    await item.save();
  } catch (err) {
    if (req.file) await deleteImage(req.file.filename);
    throw err;
  }
  // Save safal hone ke baad hi purani image hatao
  if (req.file && oldId) await deleteImage(oldId);

  res.json({ success: true, data: item });
};

export const deleteGalleryItem = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Gallery photo not found');
  }
  await deleteImage(item.image?.public_id);
  await item.deleteOne();
  res.json({ success: true, message: 'Photo deleted' });
};

// DELETE /api/gallery  body: { ids: [...] }
export const deleteManyGallery = async (req, res) => {
  const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).filter((id) => mongoose.isValidObjectId(id));
  if (!ids.length) {
    res.status(400);
    throw new Error('No photos selected');
  }
  const items = await GalleryItem.find({ _id: { $in: ids } });
  for (const it of items) await deleteImage(it.image?.public_id);
  await GalleryItem.deleteMany({ _id: { $in: items.map((i) => i._id) } });
  res.json({ success: true, count: items.length, message: `${items.length} photos deleted` });
};