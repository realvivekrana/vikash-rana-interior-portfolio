import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: 'Interior Designer' },
    heading: { type: String, default: 'Designing Spaces That Tell Your Story' },
    subheading: { type: String, default: 'Premium interior design for homes and offices' },
    ctaText: { type: String, default: 'View Projects' },
    ctaLink: { type: String, default: '/projects' },
    backgroundImage: { url: String, public_id: String },
  },
  { timestamps: true }
);

export default mongoose.model('Hero', heroSchema);