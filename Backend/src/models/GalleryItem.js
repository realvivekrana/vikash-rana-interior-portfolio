import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true, maxlength: 120 }, // optional caption
    category: { type: String, default: 'General', trim: true, maxlength: 40 }, // Living Room, Kitchen...
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('GalleryItem', galleryItemSchema);