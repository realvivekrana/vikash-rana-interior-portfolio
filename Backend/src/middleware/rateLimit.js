// Chhota in-memory rate limiter (extra package ki zaroorat nahi)
const rateLimit = ({ windowMs, max, message }) => {
  const hits = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, v] of hits) if (v.reset <= now) hits.delete(key);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      res.status(429);
      return next(new Error(message || 'Too many requests, please try again later'));
    }
    next();
  };
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Try again in 15 minutes.',
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: 'Too many messages sent. Please try again later.',
});

export const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: 'Too many tracking requests.',
});

// AI free tier limited hai, isliye ek IP se thode hi requests
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  message: 'You have used the AI tools a lot. Please try again in a few minutes.',
});

export default rateLimit;