import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: '' },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { url: String, public_id: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);