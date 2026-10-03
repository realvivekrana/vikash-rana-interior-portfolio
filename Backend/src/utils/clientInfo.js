import crypto from 'crypto';

export const getIp = (req) => req.ip || req.socket?.remoteAddress || '';

// Visitor ka raw IP kabhi store nahi hota, sirf salted hash
export const hashIp = (ip) =>
  crypto.createHash('sha256').update(`${ip}|${process.env.JWT_SECRET || ''}`).digest('hex').slice(0, 16);

const BOT_RE =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegram|curl|wget|python-requests|node-fetch|uptime/i;

export const isBot = (ua = '') => !ua || BOT_RE.test(ua);

export const parseUA = (ua = '') => {
  let device = 'desktop';
  if (/ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(ua)) device = 'tablet';
  else if (/mobi|iphone|ipod|windows phone/i.test(ua)) device = 'mobile';

  let browser = 'Other';
  if (/edg(e|a|ios)?\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { device, browser, os };
};