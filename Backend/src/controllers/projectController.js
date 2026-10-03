import Project from '../models/Project.js';
import deleteImage from '../utils/deleteImage.js';
import pick from '../utils/pick.js';

const FIELDS = [
  'title', 'category', 'description', 'location', 'area',
  'year', 'client', 'featured', 'isPublished', 'order',
];

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
  const body = pick(req.body, FIELDS);
  if (req.files?.coverImage?.[0]) body.coverImage = toImage(req.files.coverImage[0]);
  if (req.files?.images) body.images = req.files.images.map(toImage);

  if (!body.coverImage && body.images?.length) body.coverImage = body.images[0];

  try {
    const project = await Project.create(body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    // Save fail hua to upload ho chuki images Cloudinary se hata do
    const ids = new Set([body.coverImage?.public_id, ...(body.images || []).map((i) => i.public_id)]);
    for (const id of ids) await deleteImage(id);
    throw err;
  }
};

export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  Object.assign(project, pick(req.body, FIELDS));

  // Gallery se chuni hui images hatao (removeImages = JSON array of public_ids)
  let removeIds = [];
  if (req.body.removeImages) {
    try {
      removeIds = JSON.parse(req.body.removeImages);
    } catch {
      removeIds = [];
    }
    project.images = project.images.filter((img) => !removeIds.includes(img.public_id));
  }

  const oldCoverId = project.coverImage?.public_id;
  const newUploads = [];
  if (req.files?.coverImage?.[0]) {
    project.coverImage = toImage(req.files.coverImage[0]);
    newUploads.push(project.coverImage.public_id);
  }
  if (req.files?.images) {
    const added = req.files.images.map(toImage);
    project.images.push(...added);
    newUploads.push(...added.map((i) => i.public_id));
  }

  try {
    await project.save();
  } catch (err) {
    for (const id of newUploads) await deleteImage(id);
    throw err;
  }

  // Save safal hone ke baad hi purani images Cloudinary se hatao.
  // Cover aur gallery ek hi image share kar sakte hain, isliye jo abhi bhi use ho rahi hai use mat hatao.
  const inUse = new Set([project.coverImage?.public_id, ...project.images.map((i) => i.public_id)]);
  const toDelete = [...removeIds];
  if (req.files?.coverImage?.[0] && oldCoverId) toDelete.push(oldCoverId);
  for (const id of new Set(toDelete)) {
    if (!inUse.has(id)) await deleteImage(id);
  }

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