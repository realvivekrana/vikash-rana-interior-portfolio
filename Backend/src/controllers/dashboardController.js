import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Message from '../models/Message.js';
import Skill from '../models/Skill.js';
import Document from '../models/Document.js';
import Visit from '../models/Visit.js';
import Activity from '../models/Activity.js';
import { startOfDay } from '../utils/time.js';

export const getStats = async (req, res) => {
  const liveSince = new Date(Date.now() - 5 * 60 * 1000);

  const [
    projects, featured, services, testimonials, messages, unread, recentMessages,
    skills, documents, downloadAgg, viewsToday, live, recentActivity,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ featured: true }),
    Service.countDocuments(),
    Testimonial.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ isRead: false }),
    Message.find().sort({ createdAt: -1 }).limit(5),
    Skill.countDocuments(),
    Document.countDocuments(),
    Document.aggregate([{ $group: { _id: null, n: { $sum: '$downloads' } } }]),
    Visit.countDocuments({ createdAt: { $gte: startOfDay() } }),
    Visit.distinct('sid', { createdAt: { $gte: liveSince } }),
    Activity.find().sort({ createdAt: -1 }).limit(6),
  ]);

  res.json({
    success: true,
    data: {
      projects, featured, services, testimonials, messages, unread, recentMessages,
      skills, documents,
      downloads: downloadAgg[0]?.n || 0,
      viewsToday,
      liveVisitors: live.length,
      recentActivity,
    },
  });
};