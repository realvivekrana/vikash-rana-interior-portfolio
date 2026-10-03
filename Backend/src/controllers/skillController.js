import Skill from '../models/Skill.js';
import pick from '../utils/pick.js';

const FIELDS = ['name', 'level', 'category', 'order', 'isActive'];

export const getSkills = async (req, res) => {
  const data = await Skill.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const getSkillsAdmin = async (req, res) => {
  const data = await Skill.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data });
};

export const createSkill = async (req, res) => {
  const data = await Skill.create(pick(req.body, FIELDS));
  res.status(201).json({ success: true, data });
};

export const updateSkill = async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  Object.assign(skill, pick(req.body, FIELDS));
  await skill.save();
  res.json({ success: true, data: skill });
};

export const deleteSkill = async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  await skill.deleteOne();
  res.json({ success: true, message: 'Skill deleted' });
};