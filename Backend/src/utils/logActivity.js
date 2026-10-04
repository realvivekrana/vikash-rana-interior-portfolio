import Activity from '../models/Activity.js';
import { getIp, parseUA } from './clientInfo.js';

// Fire-and-forget: log fail ho to bhi asli request nahi rukti
export const logActivity = (req, data) => {
  try {
    const ua = req?.headers?.['user-agent'] || '';
    const { device, browser, os } = parseUA(ua);
    Activity.create({ ip: req ? getIp(req) : '', device, browser, os, ...data }).catch((e) =>
      console.error('Activity log failed:', e.message)
    );
  } catch (e) {
    console.error('Activity log failed:', e.message);
  }
};

const ENTITIES = {
  projects: 'Project',
  services: 'Service',
  testimonials: 'Testimonial',
  hero: 'Hero section',
  about: 'About page',
  settings: 'Settings',
  messages: 'Message',
  skills: 'Skill',
  documents: 'Document',
  gallery: 'Gallery photo',
  'ai-tools': 'AI tool',
  auth: 'Account',
};

// Har successful admin write (POST/PUT/PATCH/DELETE) apne aap log ho jaata hai
export const auditMiddleware = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

  let payload;
  const json = res.json.bind(res);
  res.json = (body) => {
    payload = body;
    return json(body);
  };

  res.on('finish', () => {
    if (!req.admin || res.statusCode >= 400) return;

    const parts = req.originalUrl.split('?')[0].split('/').filter(Boolean); // ['api','projects',':id']
    const resource = parts[1];
    const entity = ENTITIES[resource];
    if (!entity) return;

    const tail = parts.slice(2).join('/');
    // Sirf padhne ka toggle log nahi karte (bahut shor hota hai)
    if (resource === 'messages' && req.method === 'PATCH' && tail !== 'read-all') return;

    let action = { POST: 'created', PUT: 'updated', PATCH: 'updated', DELETE: 'deleted' }[req.method];
    let label = '';
    const d = payload?.data;
    const name = d?.title || d?.name || d?.heading || d?.siteName || req.body?.title || req.body?.name || '';

    if (resource === 'auth') {
      action = 'password_changed';
      label = 'Admin password changed';
    } else if (resource === 'messages') {
      label = tail === 'read-all' ? 'Marked all messages as read' : 'Deleted a message';
      if (tail === 'read-all') action = 'updated';
    } else {
      const noun = entity.toLowerCase();
      const verb = action === 'created' ? 'Added' : action === 'deleted' ? 'Deleted' : 'Updated';
      // Bulk upload/delete: "Added 5 gallery photos"
      const n = Array.isArray(d) ? d.length : payload?.count;
      label = n > 1 ? `${verb} ${n} ${noun}s` : name ? `${verb} ${noun}: ${name}` : `${verb} ${noun}`;
    }

    logActivity(req, {
      kind: resource === 'auth' ? 'auth' : resource === 'messages' ? 'message' : 'content',
      action,
      entity,
      label: String(label).slice(0, 200),
      actor: req.admin.email,
    });
  });

  next();
};