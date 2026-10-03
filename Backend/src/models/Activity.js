import mongoose from 'mongoose';

// Admin ke kaam + security events + visitor actions (message, download) ka log
const activitySchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['auth', 'content', 'message', 'download', 'system'], required: true },
    action: { type: String, required: true }, // created, updated, deleted, login, login_failed, received, ...
    entity: { type: String, default: '' }, // Project, Service, Resume...
    label: { type: String, default: '', maxlength: 200 },
    actor: { type: String, default: 'System' }, // admin email ya "Visitor"
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    ip: { type: String, default: '' },
    device: { type: String, default: '' },
    browser: { type: String, default: '' },
    os: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ kind: 1, createdAt: -1 });
// 90 din baad purane logs apne aap delete
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.model('Activity', activitySchema);