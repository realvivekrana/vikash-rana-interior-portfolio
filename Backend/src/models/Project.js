import mongoose from 'mongoose';
import crypto from 'crypto';

const imageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, public_id: { type: String, required: true } },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, required: true, trim: true }, // Living Room, Bedroom, Kitchen...
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    area: { type: String, default: '' },
    year: { type: String, default: '' },
    client: { type: String, default: '' },
    coverImage: imageSchema,
    images: [imageSchema],
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function () {
  if (this.isModified('title') || !this.slug) {
    const base = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    this.slug = `${base}-${crypto.randomBytes(3).toString('hex')}`;
  }
});

export default mongoose.model('Project', projectSchema);