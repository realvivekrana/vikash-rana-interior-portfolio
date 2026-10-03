import Visit from '../models/Visit.js';
import Activity from '../models/Activity.js';
import { getIp, hashIp, isBot, parseUA } from '../utils/clientInfo.js';
import { TZ, DAY, dayKey, startOfDay } from '../utils/time.js';

const ID_RE = /^[\w-]{8,64}$/;
const KINDS = ['auth', 'content', 'message', 'download', 'system'];

// PUBLIC: frontend har page change par yeh call karta hai (204 = kuch return nahi)
export const trackVisit = async (req, res) => {
  const { path, sid, vid, referrer, returning } = req.body || {};
  const ua = req.headers['user-agent'] || '';

  const valid =
    typeof path === 'string' &&
    path.startsWith('/') &&
    path.length <= 300 &&
    !path.startsWith('/admin') &&
    ID_RE.test(sid || '') &&
    ID_RE.test(vid || '');
  if (!valid || isBot(ua)) return res.status(204).end();

  // Same session + same page 3 second ke andar dobara aaye (React StrictMode / refresh) to ignore
  const dup = await Visit.exists({ sid, path, createdAt: { $gte: new Date(Date.now() - 3000) } });
  if (dup) return res.status(204).end();

  let ref = '';
  try {
    if (referrer) {
      const host = new URL(referrer).hostname.replace(/^www\./, '');
      const own = (req.headers.origin || '') + (req.headers.host || '');
      if (host && !own.includes(host)) ref = host.slice(0, 80);
    }
  } catch {
    /* galat referrer ignore */
  }

  await Visit.create({
    path: path.split('?')[0],
    sid,
    vid,
    returning: !!returning,
    referrer: ref,
    ipHash: hashIp(getIp(req)),
    ...parseUA(ua),
  });
  res.status(204).end();
};

// ADMIN: poora monitoring overview
export const getOverview = async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 90);
  const now = Date.now();
  // "days" = aaj samet pichhle N calendar din
  const since = startOfDay(new Date(now - (days - 1) * DAY));
  const prevSince = new Date(since.getTime() - days * DAY);
  const liveSince = new Date(now - 5 * 60 * 1000);
  const dayAgo = new Date(now - DAY);

  const [facet, prevViews, liveSessions, liveRecent, recent, byKind, failedLogins, logins] = await Promise.all([
    Visit.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
                views: { $sum: 1 },
                visitors: { $addToSet: '$vid' },
              },
            },
            { $project: { views: 1, visitors: { $size: '$visitors' } } },
          ],
          visitors: [
            { $group: { _id: '$vid', returning: { $max: '$returning' } } },
            { $group: { _id: null, total: { $sum: 1 }, returning: { $sum: { $cond: ['$returning', 1, 0] } } } },
          ],
          sessions: [{ $group: { _id: '$sid' } }, { $count: 'n' }],
          pages: [{ $group: { _id: '$path', views: { $sum: 1 } } }, { $sort: { views: -1 } }, { $limit: 8 }],
          devices: [{ $group: { _id: '$device', n: { $sum: 1 } } }, { $sort: { n: -1 } }],
          browsers: [{ $group: { _id: '$browser', n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 5 }],
          referrers: [
            { $group: { _id: { $ifNull: ['$referrer', ''] }, n: { $sum: 1 } } },
            { $sort: { n: -1 } },
            { $limit: 6 },
          ],
          hours: [{ $group: { _id: { $hour: { date: '$createdAt', timezone: TZ } }, n: { $sum: 1 } } }],
          total: [{ $count: 'n' }],
        },
      },
    ]),
    Visit.countDocuments({ createdAt: { $gte: prevSince, $lt: since } }),
    Visit.distinct('sid', { createdAt: { $gte: liveSince } }),
    Visit.find({ createdAt: { $gte: liveSince } })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('path device browser os referrer createdAt'),
    Visit.find().sort({ createdAt: -1 }).limit(10).select('path device browser os referrer returning createdAt'),
    Activity.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: '$kind', n: { $sum: 1 } } }]),
    Activity.countDocuments({ kind: 'auth', action: 'login_failed', createdAt: { $gte: dayAgo } }),
    Activity.find({ kind: 'auth', action: { $in: ['login', 'login_failed'] } })
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  const f = facet[0] || {};
  const dailyMap = new Map((f.daily || []).map((d) => [d._id, d]));
  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const key = dayKey(new Date(now - i * DAY));
    const d = dailyMap.get(key);
    series.push({ date: key, views: d?.views || 0, visitors: d?.visitors || 0 });
  }

  const hours = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    views: (f.hours || []).find((x) => x._id === h)?.n || 0,
  }));

  const totalViews = f.total?.[0]?.n || 0;
  const uniq = f.visitors?.[0] || { total: 0, returning: 0 };
  const today = series[series.length - 1] || { views: 0, visitors: 0 };

  res.json({
    success: true,
    data: {
      range: { days, since, timezone: TZ },
      totals: {
        views: totalViews,
        visitors: uniq.total,
        returningVisitors: uniq.returning,
        sessions: f.sessions?.[0]?.n || 0,
        prevViews,
        viewsChange: prevViews > 0 ? Math.round(((totalViews - prevViews) / prevViews) * 100) : null,
      },
      today,
      series,
      hours,
      pages: (f.pages || []).map((p) => ({ path: p._id, views: p.views })),
      devices: (f.devices || []).map((d) => ({ name: d._id || 'unknown', count: d.n })),
      browsers: (f.browsers || []).map((b) => ({ name: b._id || 'Other', count: b.n })),
      referrers: (f.referrers || []).map((r) => ({ name: r._id, count: r.n })),
      live: { count: liveSessions.length, pages: liveRecent },
      recentVisits: recent,
      activityByKind: Object.fromEntries(byKind.map((k) => [k._id, k.n])),
      security: { failedLogins24h: failedLogins, recentLogins: logins },
    },
  });
};

// ADMIN: activity feed (filter + pagination)
export const getLogs = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);

  const filter = {};
  if (KINDS.includes(req.query.kind)) filter.kind = req.query.kind;
  if (req.query.status === 'failed') filter.status = 'failed';
  const q = String(req.query.q || '').trim().slice(0, 60);
  if (q) filter.label = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };

  const [data, total] = await Promise.all([
    Activity.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Activity.countDocuments(filter),
  ]);

  res.json({ success: true, data, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
};