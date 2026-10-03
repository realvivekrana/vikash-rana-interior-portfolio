import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';
import { logActivity } from '../utils/logActivity.js';

export const login = async (req, res) => {
  const { email: rawEmail, password: rawPassword } = req.body || {};
  if (!rawEmail || !rawPassword) {
    res.status(400);
    throw new Error('Email and password required');
  }
  // String() se object/array inject nahi ho sakta; email DB mein lowercase store hota hai
  const email = String(rawEmail).trim().toLowerCase();
  const password = String(rawPassword);

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password))) {
    logActivity(req, {
      kind: 'auth',
      action: 'login_failed',
      entity: 'Account',
      label: `Failed login attempt for ${String(email).slice(0, 80)}`,
      actor: String(email).slice(0, 80),
      status: 'failed',
    });
    res.status(401);
    throw new Error('Invalid email or password');
  }

  logActivity(req, {
    kind: 'auth',
    action: 'login',
    entity: 'Account',
    label: 'Admin logged in',
    actor: admin.email,
  });

  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email },
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const admin = await Admin.findById(req.admin._id).select('+password');
  if (!(await admin.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();
  res.json({ success: true, message: 'Password updated' });
};