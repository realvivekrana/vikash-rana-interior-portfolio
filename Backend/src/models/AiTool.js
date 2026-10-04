import mongoose from 'mongoose';

// "AI tools we use" showcase (admin se manage hota hai)
const aiToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, default: '', trim: true, maxlength: 300 },
    category: { type: String, default: 'Design', trim: true, maxlength: 40 }, // Design / Visualization / Writing...
    url: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
      validate: {
        validator: (v) => !v || /^https?:\/\//i.test(v),
        message: 'Link must start with http:// or https://',
      },
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('AiTool', aiToolSchema);