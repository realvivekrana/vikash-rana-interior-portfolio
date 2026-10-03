import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password required');
  }

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

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