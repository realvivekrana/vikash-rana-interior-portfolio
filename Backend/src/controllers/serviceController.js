import Service from '../models/Service.js';
import deleteImage from '../utils/deleteImage.js';

export const getServices = async (req, res) => {
  const data = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const getServicesAdmin = async (req, res) => {
  const data = await Service.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const createService = async (req, res) => {
  const body = { ...req.body };
  if (req.file) body.image = { url: req.file.path, public_id: req.file.filename };
  const data = await Service.create(body);
  res.status(201).json({ success: true, data });
};

export const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  Object.assign(service, req.body);
  if (req.file) {
    await deleteImage(service.image?.public_id);
    service.image = { url: req.file.path, public_id: req.file.filename };
  }
  await service.save();
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