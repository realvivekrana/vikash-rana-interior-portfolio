import Message from '../models/Message.js';

// PUBLIC: contact form submit
export const createMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email and message are required');
  }
  await Message.create({ name, email, phone, subject, message });
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