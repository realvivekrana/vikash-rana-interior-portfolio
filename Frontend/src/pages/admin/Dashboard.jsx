import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaImages, FaStar, FaConciergeBell, FaQuoteLeft, FaEnvelope, FaEnvelopeOpenText,
  FaTasks, FaFilePdf, FaDownload, FaChartLine,
} from 'react-icons/fa';
import api from '../../api/axios';
import { timeAgo } from '../../utils/format';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = () =>
      api
        .get('/dashboard/stats')
        .then((res) => {
          setStats(res.data.data);
          setError('');
        })
        .catch(() => setError('Could not load stats. Is the backend running?'));
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (error && !stats) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-neutral-500">Loading...</p>;

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FaImages },
    { label: 'Featured', value: stats.featured, icon: FaStar },
    { label: 'Services', value: stats.services, icon: FaConciergeBell },
    { label: 'Skills', value: stats.skills, icon: FaTasks },
    { label: 'Testimonials', value: stats.testimonials, icon: FaQuoteLeft },
    { label: 'Messages', value: stats.messages, icon: FaEnvelope },
    { label: 'Unread', value: stats.unread, icon: FaEnvelopeOpenText },
    { label: 'PDFs / Resume', value: stats.documents, icon: FaFilePdf },
    { label: 'Downloads', value: stats.downloads, icon: FaDownload },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-white mb-1">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-6">Site ka overview</p>

      {/* Live strip: poora monitoring page ka shortcut */}
      <Link
        to="/admin/activity"
        className="flex items-center justify-between gap-4 bg-surface border border-gold/40 hover:border-gold p-4 sm:p-5 mb-6 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${stats.liveVisitors ? 'animate-ping' : 'hidden'}`} />
            <span className={`relative inline-flex h-3 w-3 rounded-full ${stats.liveVisitors ? 'bg-green-500' : 'bg-neutral-600'}`} />
          </span>
          <div className="min-w-0">
            <p className="text-white text-sm">
              <span className="font-serif text-xl tabular-nums">{stats.liveVisitors}</span> live now
              <span className="text-neutral-600"> · </span>
              <span className="font-serif text-xl tabular-nums">{stats.viewsToday}</span> views today
            </p>
            <p className="text-neutral-500 text-xs">Full visitor and activity monitoring dekho</p>
          </div>
        </div>
        <FaChartLine className="text-gold text-xl shrink-0" />
      </Link>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface border border-line p-4 sm:p-5 md:p-6 hover:border-gold/50 transition-colors">
            <Icon className="text-gold text-xl mb-4" />
            <p className="font-serif text-3xl text-white">{value}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif text-xl text-white mb-4">Recent Messages</h2>
          <div className="bg-surface border border-line divide-y divide-line">
            {stats.recentMessages.length === 0 && (
              <p className="p-5 text-neutral-500 text-sm">Abhi koi message nahi aaya.</p>
            )}
            {stats.recentMessages.map((m) => (
              <div key={m._id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium">
                    {m.name}
                    {!m.isRead && <span className="ml-2 text-[10px] text-gold border border-gold px-1.5 py-0.5">NEW</span>}
                  </p>
                  <p className="text-neutral-500 text-sm truncate">{m.message}</p>
                </div>
                <span className="text-neutral-600 text-xs whitespace-nowrap">{timeAgo(m.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-white">Recent Activity</h2>
            <Link to="/admin/activity" className="text-gold text-xs uppercase tracking-[0.2em] hover:text-gold-light py-2">
              View all →
            </Link>
          </div>
          <div className="bg-surface border border-line divide-y divide-line">
            {stats.recentActivity.length === 0 && (
              <p className="p-5 text-neutral-500 text-sm">Abhi koi activity record nahi hui.</p>
            )}
            {stats.recentActivity.map((a) => (
              <div key={a._id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className={`text-sm break-words ${a.status === 'failed' ? 'text-red-300' : 'text-neutral-200'}`}>
                    {a.label || `${a.action} ${a.entity}`}
                  </p>
                  <p className="text-neutral-600 text-xs mt-0.5 truncate">{a.actor}</p>
                </div>
                <span className="text-neutral-600 text-xs whitespace-nowrap">{timeAgo(a.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;