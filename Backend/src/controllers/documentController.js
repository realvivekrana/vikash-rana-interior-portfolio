import Document, { DOC_TYPES } from '../models/Document.js';
import deleteFile from '../utils/deleteFile.js';
import pick from '../utils/pick.js';
import { logActivity } from '../utils/logActivity.js';

const FIELDS = ['title', 'type', 'description', 'order', 'isActive', 'isPrimary'];

// Public API Cloudinary ka asli URL nahi dikhati; download /:id/file se hota hai (taaki count ho sake)
const PUBLIC_SELECT = '-file.url -file.public_id';

// Ek type (resume) mein sirf ek file primary ho sakti hai
const enforcePrimary = async (doc) => {
  if (doc.type !== 'resume') {
    doc.isPrimary = false;
    return;
  }
  if (doc.isPrimary) {
    await Document.updateMany({ type: 'resume', _id: { $ne: doc._id } }, { isPrimary: false });
  }
};

export const getDocuments = async (req, res) => {
  const filter = { isActive: true };
  if (DOC_TYPES.includes(req.query.type)) filter.type = req.query.type;
  const data = await Document.find(filter).sort({ order: 1, createdAt: -1 }).select(PUBLIC_SELECT);
  res.json({ success: true, data });
};

export const getPrimaryResume = async (req, res) => {
  const data = await Document.findOne({ type: 'resume', isActive: true })
    .sort({ isPrimary: -1, updatedAt: -1 })
    .select(PUBLIC_SELECT);
  res.json({ success: true, data });
};

export const getDocumentsAdmin = async (req, res) => {
  const data = await Document.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data });
};

export const createDocument = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('PDF file is required');
  }
  const body = pick(req.body, FIELDS);
  body.file = {
    url: req.file.path,
    public_id: req.file.filename,
    size: req.file.size || 0,
    originalName: req.file.originalname || '',
  };
  try {
    const doc = new Document(body);
    // Pehla resume apne aap primary ban jaaye
    if (doc.type === 'resume' && !(await Document.exists({ type: 'resume', isPrimary: true }))) doc.isPrimary = true;
    await enforcePrimary(doc);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    await deleteFile(req.file.filename);
    throw err;
  }
};

export const updateDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) {
    if (req.file) await deleteFile(req.file.filename);
    res.status(404);
    throw new Error('Document not found');
  }
  Object.assign(doc, pick(req.body, FIELDS));
  const oldId = doc.file?.public_id;
  if (req.file) {
    doc.file = {
      url: req.file.path,
      public_id: req.file.filename,
      size: req.file.size || 0,
      originalName: req.file.originalname || '',
    };
  }
  try {
    await enforcePrimary(doc);
    await doc.save();
  } catch (err) {
    if (req.file) await deleteFile(req.file.filename);
    throw err;
  }
  if (req.file) await deleteFile(oldId);
  res.json({ success: true, data: doc });
};

export const deleteDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) {
    res.status(404);
    throw new Error('Document not found');
  }
  await deleteFile(doc.file?.public_id);
  await doc.deleteOne();
  res.json({ success: true, message: 'Document deleted' });
};

// PUBLIC: /documents/:id/file?mode=view|download -> count badhao, phir Cloudinary par redirect
export const serveFile = async (req, res) => {
  const mode = req.query.mode === 'view' ? 'view' : 'download';
  const doc = await Document.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { $inc: mode === 'view' ? { views: 1 } : { downloads: 1 } },
    { new: true }
  );
  if (!doc) {
    res.status(404);
    throw new Error('File not found');
  }

  if (mode === 'download') {
    logActivity(req, {
      kind: 'download',
      action: 'downloaded',
      entity: doc.type === 'resume' ? 'Resume' : 'Document',
      label: `Downloaded: ${doc.title}`,
      actor: 'Visitor',
    });
  }

  const url =
    mode === 'download' && doc.file.url.includes('/upload/')
      ? doc.file.url.replace('/upload/', '/upload/fl_attachment/')
      : doc.file.url;
  res.redirect(302, url);
};