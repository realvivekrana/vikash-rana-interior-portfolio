import AiTool from '../models/AiTool.js';
import pick from '../utils/pick.js';

const FIELDS = ['name', 'description', 'category', 'url', 'order', 'isActive'];

export const getAiTools = async (req, res) => {
  const data = await AiTool.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const getAiToolsAdmin = async (req, res) => {
  const data = await AiTool.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const createAiTool = async (req, res) => {
  const data = await AiTool.create(pick(req.body, FIELDS));
  res.status(201).json({ success: true, data });
};

export const updateAiTool = async (req, res) => {
  const tool = await AiTool.findById(req.params.id);
  if (!tool) {
    res.status(404);
    throw new Error('AI tool not found');
  }
  Object.assign(tool, pick(req.body, FIELDS));
  await tool.save();
  res.json({ success: true, data: tool });
};

export const deleteAiTool = async (req, res) => {
  const tool = await AiTool.findById(req.params.id);
  if (!tool) {
    res.status(404);
    throw new Error('AI tool not found');
  }
  await tool.deleteOne();
  res.json({ success: true, message: 'AI tool deleted' });
};