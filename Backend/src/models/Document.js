import mongoose from 'mongoose';

export const DOC_TYPES = ['resume', 'portfolio', 'brochure', 'other'];

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, enum: DOC_TYPES, default: 'resume' },
    description: { type: String, default: '', maxlength: 300 },
    file: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      size: { type: Number, default: 0 }, // bytes
      originalName: { type: String, default: '' },
    },
    isPrimary: { type: Boolean, default: false }, // sirf resume ke liye: "Download Resume" button yehi file dega
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);