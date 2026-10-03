import mongoose from 'mongoose';

// Public site ka har page view. Visitor ka IP hashed rehta hai.
const visitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, maxlength: 300 },
    sid: { type: String, required: true }, // session id (tab band hone tak)
    vid: { type: String, required: true }, // visitor id (browser mein permanent)
    returning: { type: Boolean, default: false },
    device: { type: String, default: 'desktop' },
    browser: { type: String, default: '' },
    os: { type: String, default: '' },
    referrer: { type: String, default: '' }, // sirf host, e.g. google.com ("" = direct)
    ipHash: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 }); // 180 din
visitSchema.index({ sid: 1, createdAt: -1 });

export default mongoose.model('Visit', visitSchema);