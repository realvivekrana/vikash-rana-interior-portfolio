import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Vikash Rana Interiors' },
    logo: { url: String, public_id: String },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    mapEmbed: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
      pinterest: { type: String, default: '' },
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);