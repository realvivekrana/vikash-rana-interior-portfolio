import Message from '../models/Message.js';
import { logActivity } from '../utils/logActivity.js';

// PUBLIC: contact form submit
export const createMessage = async (req, res) => {
  const { name, email, phone, subject, message, website } = req.body || {};

  // Honeypot: bots hidden "website" field bhar dete hain. Chupchap success dikha do.
  if (website) return res.status(201).json({ success: true, message: 'Message sent successfully' });

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400);
    throw new Error('Name, email and message are required');
  }
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    res.status(400);
    throw new Error('Please enter a valid email');
  }
  await Message.create({
    name: name.trim(),
    email: email.trim(),
    phone: (phone || '').trim().slice(0, 30),
    subject: (subject || '').trim().slice(0, 150),
    message: message.trim(),
  });
  logActivity(req, {
    kind: 'message',
    action: 'received',
    entity: 'Message',
    label: `New contact message from ${name.trim().slice(0, 60)}`,
    actor: 'Visitor',
  });
  res.status(201).json({ success: true, message: 'Message sent successfully' });
};

// ADMIN
export const getMessages = async (req, res) => {
  const data = await Message.find().sort({ createdAt: -1 });
  const unread = await Message.countDocuments({ isRead: false });
  res.json({ success: true, unread, data });
};

export const toggleRead = async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error('Message not found');
  }
  msg.isRead = !msg.isRead;
  await msg.save();
  res.json({ success: true, data: msg });
};

export const deleteMessage = async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error('Message not found');
  }
  await msg.deleteOne();
  res.json({ success: true, message: 'Message deleted' });
};

export const markAllRead = async (req, res) => {
  await Message.updateMany({ isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All messages marked as read' });
};