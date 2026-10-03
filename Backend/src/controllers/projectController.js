import Project from '../models/Project.js';
import deleteImage from '../utils/deleteImage.js';

const toImage = (file) => ({ url: file.path, public_id: file.filename });

// PUBLIC
export const getProjects = async (req, res) => {
  const { category, featured } = req.query;
  const filter = { isPublished: true };
  if (category && category !== 'All') filter.category = category;
  if (featured === 'true') filter.featured = true;

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
};

export const getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, isPublished: true });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, data: project });
};

export const getCategories = async (req, res) => {
  const categories = await Project.distinct('category', { isPublished: true });
  res.json({ success: true, data: categories });
};

// ADMIN
export const getAllProjectsAdmin = async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, data: project });
};

export const createProject = async (req, res) => {
  const body = { ...req.body };
  if (req.files?.coverImage?.[0]) body.coverImage = toImage(req.files.coverImage[0]);
  if (req.files?.images) body.images = req.files.images.map(toImage);

  if (!body.coverImage && body.images?.length) body.coverImage = body.images[0];

  const project = await Project.create(body);
  res.status(201).json({ success: true, data: project });
};

export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { removeImages, ...fields } = req.body;
  Object.assign(project, fields);

  // Gallery se chuni hui images hatao (removeImages = JSON array of public_ids)
  if (removeImages) {
    const ids = JSON.parse(removeImages);
    for (const id of ids) await deleteImage(id);
    project.images = project.images.filter((img) => !ids.includes(img.public_id));
  }

  if (req.files?.coverImage?.[0]) {
    await deleteImage(project.coverImage?.public_id);
    project.coverImage = toImage(req.files.coverImage[0]);
  }
  if (req.files?.images) {
    project.images.push(...req.files.images.map(toImage));
  }

  await project.save();
  res.json({ success: true, data: project });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const ids = new Set([project.coverImage?.public_id, ...project.images.map((i) => i.public_id)]);
  for (const id of ids) await deleteImage(id);

  await project.deleteOne();
  res.json({ success: true, message: 'Project deleted' });
};