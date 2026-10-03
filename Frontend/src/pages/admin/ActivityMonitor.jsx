import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaSyncAlt, FaEye, FaUsers, FaUserCheck, FaMousePointer, FaShieldAlt, FaEdit,
  FaEnvelope, FaDownload, FaCog, FaMobileAlt, FaDesktop, FaTabletAlt, FaSearch,
  FaArrowUp, FaArrowDown, FaExclamationTriangle,
} from 'react-icons/fa';
import api from '../../api/axios';
import PageHeader from '../../components/admin/PageHeader';
import { inputClass } from '../../utils/ui';
import { formatDay, timeAgo } from '../../utils/format';

const RANGES = [7, 14, 30, 90];
const REFRESH_MS = 30000;

const KINDS = {
  auth: { label: 'Security', icon: FaShieldAlt },
  content: { label: 'Content', icon: FaEdit },
  message: { label: 'Messages', icon: FaEnvelope },
  download: { label: 'Downloads', icon: FaDownload },
  system: { label: 'System', icon: FaCog },
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'content', label: 'Content' },
  { key: 'auth', label: 'Security' },
  { key: 'message', label: 'Messages' },
  { key: 'download', label: 'Downloads' },
  { key: 'failed', label: 'Failed' },
];

const DeviceIcon = ({ device }) =>
  device === 'mobile' ? <FaMobileAlt /> : device === 'tablet' ? <FaTabletAlt /> : <FaDesktop />;

const Card = ({ title, children, className = '' }) => (
  <section className={`bg-surface border border-line p-4 sm:p-5 ${className}`}>
    {title && <h2 className="font-serif text-lg text-white mb-4">{title}</h2>}
    {children}
  </section>
);

const Kpi = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-surface border border-line p-4 sm:p-5">
    <Icon className="text-gold text-lg mb-3" />
    <p className="font-serif text-2xl sm:text-3xl text-white tabular-nums">{value}</p>
    <p className="text-neutral-500 text-[11px] uppercase tracking-wider mt-1">{label}</p>
    {sub && <div className="text-xs mt-2">{sub}</div>}
  </div>
);

const BarList = ({ items, empty = 'Abhi data nahi hai', format = (n) => n }) => {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (!items.length) return <p className="text-neutral-500 text-sm">{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.name}>
          <div className="flex justify-between gap-3 text-sm mb-1">
            <span className="text-neutral-300 truncate">{i.label || i.name}</span>
            <span className="text-neutral-500 tabular-nums shrink-0">{format(i.count)}</span>
          </div>
          <div className="h-1 bg-line">
            <div className="h-full bg-gold" style={{ width: `${(i.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

const pct = (n, total) => (total ? `${Math.round((n / total) * 100)}%` : '0%');

const ActivityMonitor = () => {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [, setTick] = useState(0);
  const [sel, setSel] = useState(null);

  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState({ data: [], pages: 1, total: 0 });
  const [logsLoading, setLogsLoading] = useState(true);
  const logParams = useRef({});

  const loadOverview = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await api.get('/activity/overview', { params: { days } });
      setData(res.data.data);
      setError('');
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.response?.data?.message || 'Monitoring data load nahi hua. Backend chal raha hai?');
    } finally {
      setRefreshing(false);
    }
  }, [days]);

  const loadLogs = useCallback(async () => {
    const params = { page, limit: 15 };
    if (filter === 'failed') params.status = 'failed';
    else if (filter !== 'all') params.kind = filter;
    if (query) params.q = query;
    logParams.current = params;
    try {
      const res = await api.get('/activity/logs', { params });
      if (logParams.current === params) setLogs(res.data);
    } catch {
      /* overview ka error pehle se dikh raha hai */
    } finally {
      setLogsLoading(false);
    }
  }, [page, filter, query]);

  useEffect(() => {
    loadOverview();
    const t = setInterval(loadOverview, REFRESH_MS);
    return () => clearInterval(t);
  }, [loadOverview]);

  useEffect(() => {
    loadLogs();
    const t = setInterval(loadLogs, REFRESH_MS);
    return () => clearInterval(t);
  }, [loadLogs]);

  // Search box ko 400ms debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  // "Updated Xs ago" label chalta rahe
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 10000);
    return () => clearInterval(t);
  }, []);

  const refreshAll = () => {
    loadOverview(true);
    loadLogs();
  };

  if (error && !data) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-neutral-500">Loading...</p>;

  const { totals, today, series, hours, pages, devices, browsers, referrers, live, recentVisits, security } = data;
  const maxViews = Math.max(...series.map((d) => d.views), 1);
  const maxHour = Math.max(...hours.map((h) => h.views), 1);
  const picked = sel != null && series[sel] ? series[sel] : series[series.length - 1];
  const deviceTotal = devices.reduce((n, d) => n + d.count, 0);
  const returningPct = totals.visitors ? Math.round((totals.returningVisitors / totals.visitors) * 100) : 0;
  const change = totals.viewsChange;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Monitor Activity"
        subtitle={updatedAt ? `Live data · updated ${timeAgo(updatedAt)}` : 'Live data'}
        action={
          <button
            onClick={refreshAll}
            className="min-h-11 px-4 border border-line text-neutral-300 hover:border-gold hover:text-gold text-xs uppercase tracking-[0.15em] inline-flex items-center gap-2"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Range selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => {
              setDays(r);
              setSel(null);
            }}
            className={`shrink-0 min-h-11 px-5 text-xs uppercase tracking-[0.15em] border transition-colors ${
              days === r ? 'border-gold text-gold bg-gold/10' : 'border-line text-neutral-400 hover:border-gold/60'
            }`}
          >
            Last {r} days
          </button>
        ))}
      </div>

      {/* Live now */}
      <Card className="mb-6 !border-gold/40">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${live.count ? 'animate-ping' : 'hidden'}`} />
            <span className={`relative inline-flex h-3 w-3 rounded-full ${live.count ? 'bg-green-500' : 'bg-neutral-600'}`} />
          </span>
          <p className="text-white">
            <span className="font-serif text-2xl tabular-nums">{live.count}</span>{' '}
            <span className="text-neutral-400 text-sm">visitor{live.count === 1 ? '' : 's'} on the site right now (last 5 min)</span>
          </p>
        </div>
        {live.pages.length > 0 && (
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {live.pages.map((p) => (
              <li key={p._id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 min-w-0 text-neutral-300">
                  <span className="text-gold shrink-0"><DeviceIcon device={p.device} /></span>
                  <span className="truncate">{p.path}</span>
                </span>
                <span className="text-neutral-600 text-xs shrink-0">{timeAgo(p.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Kpi
          icon={FaEye}
          label="Page views"
          value={totals.views.toLocaleString('en-IN')}
          sub={
            change == null ? (
              <span className="text-neutral-600">No previous data</span>
            ) : (
              <span className={`inline-flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(change)}% vs previous {days}d
              </span>
            )
          }
        />
        <Kpi icon={FaUsers} label="Unique visitors" value={totals.visitors.toLocaleString('en-IN')} sub={<span className="text-neutral-600">Today: {today.visitors}</span>} />
        <Kpi icon={FaMousePointer} label="Sessions" value={totals.sessions.toLocaleString('en-IN')} sub={<span className="text-neutral-600">{totals.sessions ? (totals.views / totals.sessions).toFixed(1) : 0} pages / session</span>} />
        <Kpi icon={FaUserCheck} label="Returning" value={`${returningPct}%`} sub={<span className="text-neutral-600">{totals.returningVisitors} of {totals.visitors}</span>} />
      </div>

      {/* Daily chart */}
      <Card title="Daily page views" className="mb-6">
        <div className="flex items-end gap-px sm:gap-0.5 h-40" role="img" aria-label="Daily page views chart">
          {series.map((d, i) => (
            <button
              key={d.date}
              type="button"
              onClick={() => setSel(i)}
              aria-label={`${formatDay(d.date)}: ${d.views} views`}
              className="group flex-1 h-full flex items-end min-w-0"
            >
              <span
                className={`w-full transition-colors ${picked?.date === d.date ? 'bg-gold' : 'bg-gold/40 group-hover:bg-gold/70'}`}
                style={{ height: `${Math.max((d.views / maxViews) * 100, d.views ? 3 : 1)}%` }}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-neutral-600 mt-2">
          <span>{formatDay(series[0].date)}</span>
          <span>{formatDay(series[series.length - 1].date)}</span>
        </div>
        {picked && (
          <p className="mt-4 pt-4 border-t border-line text-sm text-neutral-300">
            <span className="text-gold">{formatDay(picked.date)}</span>: {picked.views} views · {picked.visitors} visitors
            <span className="text-neutral-600"> (bar par tap karke din badlo)</span>
          </p>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card title="Top pages">
          <BarList items={pages.map((p) => ({ name: p.path, count: p.views }))} />
        </Card>
        <Card title="Traffic sources">
          <BarList
            items={referrers.map((r) => ({ name: r.name || 'direct', label: r.name || 'Direct / unknown', count: r.count }))}
          />
        </Card>
        <Card title="Devices">
          <BarList
            items={devices.map((d) => ({ name: d.name, label: d.name[0].toUpperCase() + d.name.slice(1), count: d.count }))}
            format={(n) => `${pct(n, deviceTotal)} · ${n}`}
          />
        </Card>
        <Card title="Browsers">
          <BarList items={browsers} />
        </Card>
      </div>

      <Card title="Peak hours" className="mb-6">
        <div className="flex items-end gap-px sm:gap-0.5 h-24">
          {hours.map((h) => (
            <div key={h.hour} className="flex-1 h-full flex items-end min-w-0" title={`${h.hour}:00 - ${h.views} views`}>
              <span className="w-full bg-gold/60" style={{ height: `${Math.max((h.views / maxHour) * 100, h.views ? 4 : 1)}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-neutral-600 mt-2">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card title="Recent visits">
          {recentVisits.length === 0 ? (
            <p className="text-neutral-500 text-sm">Abhi koi visit record nahi hua.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentVisits.map((v) => (
                <li key={v._id} className="py-3 flex items-start gap-3 text-sm">
                  <span className="text-gold mt-0.5 shrink-0"><DeviceIcon device={v.device} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-neutral-200 truncate">{v.path}</p>
                    <p className="text-neutral-600 text-xs truncate">
                      {v.browser} · {v.os}
                      {v.referrer ? ` · from ${v.referrer}` : ''}
                      {v.returning ? ' · returning' : ''}
                    </p>
                  </div>
                  <span className="text-neutral-600 text-xs shrink-0">{timeAgo(v.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Security">
          <div className={`flex items-center gap-3 p-3 border mb-4 ${security.failedLogins24h ? 'border-red-500/50 text-red-300' : 'border-line text-neutral-300'}`}>
            {security.failedLogins24h ? <FaExclamationTriangle className="shrink-0" /> : <FaShieldAlt className="text-gold shrink-0" />}
            <p className="text-sm">
              {security.failedLogins24h
                ? `${security.failedLogins24h} failed login attempt${security.failedLogins24h > 1 ? 's' : ''} in last 24h`
                : 'No failed logins in last 24h'}
            </p>
          </div>
          {security.recentLogins.length === 0 ? (
            <p className="text-neutral-500 text-sm">Abhi koi login record nahi hai.</p>
          ) : (
            <ul className="divide-y divide-line">
              {security.recentLogins.map((l) => (
                <li key={l._id} className="py-3 flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className={`truncate ${l.status === 'failed' ? 'text-red-300' : 'text-neutral-200'}`}>
                      {l.status === 'failed' ? 'Failed login' : 'Login'} · {l.actor}
                    </p>
                    <p className="text-neutral-600 text-xs truncate">
                      {l.browser} · {l.os} · {l.ip || 'ip unknown'}
                    </p>
                  </div>
                  <span className="text-neutral-600 text-xs shrink-0">{timeAgo(l.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Activity log */}
      <Card title="Activity log">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
                setLogsLoading(true);
              }}
              className={`shrink-0 min-h-11 px-4 text-xs uppercase tracking-[0.15em] border transition-colors ${
                filter === f.key ? 'border-gold text-gold bg-gold/10' : 'border-line text-neutral-400 hover:border-gold/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative mb-4">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 text-sm pointer-events-none" />
          <input className={`${inputClass} pl-11`} placeholder="Search activity..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {logsLoading ? (
          <p className="text-neutral-500 text-sm py-6">Loading...</p>
        ) : logs.data.length === 0 ? (
          <p className="text-neutral-500 text-sm py-6 text-center border border-dashed border-line">Koi activity nahi mili.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {logs.data.map((a) => {
              const meta = KINDS[a.kind] || KINDS.system;
              const Icon = meta.icon;
              const failed = a.status === 'failed';
              return (
                <li key={a._id} className="py-3 flex items-start gap-3">
                  <span
                    className={`h-9 w-9 shrink-0 flex items-center justify-center border text-sm ${
                      failed ? 'border-red-500/50 text-red-400' : 'border-gold/40 text-gold'
                    }`}
                  >
                    <Icon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm break-words ${failed ? 'text-red-300' : 'text-neutral-200'}`}>{a.label || `${a.action} ${a.entity}`}</p>
                    <p className="text-neutral-600 text-xs mt-0.5 break-words">
                      {a.actor} · {meta.label}
                      {a.browser ? ` · ${a.browser}, ${a.os}` : ''}
                      {a.ip ? ` · ${a.ip}` : ''}
                    </p>
                  </div>
                  <span className="text-neutral-600 text-xs shrink-0" title={new Date(a.createdAt).toLocaleString('en-IN')}>
                    {timeAgo(a.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {logs.pages > 1 && (
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="min-h-11 px-5 border border-line text-neutral-300 hover:border-gold hover:text-gold disabled:opacity-40 text-xs uppercase tracking-[0.15em]"
            >
              Prev
            </button>
            <span className="text-neutral-500 text-xs">Page {page} / {logs.pages} · {logs.total} entries</span>
            <button
              disabled={page >= logs.pages}
              onClick={() => setPage((p) => p + 1)}
              className="min-h-11 px-5 border border-line text-neutral-300 hover:border-gold hover:text-gold disabled:opacity-40 text-xs uppercase tracking-[0.15em]"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityMonitor;