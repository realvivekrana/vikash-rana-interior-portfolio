import Service from '../models/Service.js';
import deleteImage from '../utils/deleteImage.js';
import pick from '../utils/pick.js';

const FIELDS = ['title', 'description', 'icon', 'order', 'isActive'];

export const getServices = async (req, res) => {
  const data = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const getServicesAdmin = async (req, res) => {
  const data = await Service.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const createService = async (req, res) => {
  const body = pick(req.body, FIELDS);
  if (req.file) body.image = { url: req.file.path, public_id: req.file.filename };
  try {
    const data = await Service.create(body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (req.file) await deleteImage(req.file.filename);
    throw err;
  }
};

export const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  Object.assign(service, pick(req.body, FIELDS));
  const oldId = service.image?.public_id;
  if (req.file) service.image = { url: req.file.path, public_id: req.file.filename };
  try {
    await service.save();
  } catch (err) {
    if (req.file) await deleteImage(req.file.filename);
    throw err;
  }
  if (req.file) await deleteImage(oldId);
  res.json({ success: true, data: service });
};

export const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  await deleteImage(service.image?.public_id);
  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted' });
};