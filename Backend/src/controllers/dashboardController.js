import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Message from '../models/Message.js';

export const getStats = async (req, res) => {
  const [projects, featured, services, testimonials, messages, unread, recentMessages] =
    await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Service.countDocuments(),
      Testimonial.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Message.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    success: true,
    data: { projects, featured, services, testimonials, messages, unread, recentMessages },
  });
};