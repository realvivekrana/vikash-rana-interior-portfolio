import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    level: { type: Number, min: 0, max: 100, default: 80 }, // proficiency %
    category: { type: String, default: 'Design', trim: true, maxlength: 40 }, // Design / Software / Execution
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);