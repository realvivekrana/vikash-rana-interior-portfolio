import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaImages, FaStar, FaConciergeBell, FaQuoteLeft, FaEnvelope, FaEnvelopeOpenText,
  FaTasks, FaFilePdf, FaDownload, FaEye, FaChartLine, FaPlus,
} from 'react-icons/fa';
import api from '../../api/axios';
import { DOC_TYPE_LABELS, timeAgo } from '../../utils/format';
import ActivityMonitor from './ActivityMonitor';

const Panel = ({ title, icon: Icon, to, linkLabel, children }) => (
  <section className="bg-surface border border-line">
    <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-line">
      <h2 className="font-serif text-lg text-white flex items-center gap-2">
        <Icon className="text-gold text-base" /> {title}
      </h2>
      <Link to={to} className="text-gold text-xs uppercase tracking-[0.2em] hover:text-gold-light min-h-11 inline-flex items-center">
        {linkLabel} →
      </Link>
    </div>
    {children}
  </section>
);

const Empty = ({ text, to, label }) => (
  <div className="p-6 text-center">
    <p className="text-neutral-500 text-sm mb-4">{text}</p>
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-2 min-h-11 px-5 border border-gold text-gold hover:bg-gold hover:text-black text-xs uppercase tracking-[0.2em] transition-colors"
    >
      <FaPlus /> {label}
    </Link>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const [st, sk, dc] = await Promise.allSettled([
        api.get('/dashboard/stats'),
        api.get('/skills/admin/all'),
        api.get('/documents/admin/all'),
      ]);
      if (st.status === 'fulfilled') {
        setStats(st.value.data.data);
        setError('');
      } else {
        setError('Could not load stats. Is the backend running?');
      }
      if (sk.status === 'fulfilled') setSkills(sk.value.data.data);
      if (dc.status === 'fulfilled') setDocs(dc.value.data.data);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (error && !stats) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-neutral-500">Loading...</p>;

  const cards = [
    { label: 'Live Now', value: stats.liveVisitors, icon: FaChartLine, live: true },
    { label: 'Views Today', value: stats.viewsToday, icon: FaEye },
    { label: 'Total Projects', value: stats.projects, icon: FaImages },
    { label: 'Featured', value: stats.featured, icon: FaStar },
    { label: 'Services', value: stats.services, icon: FaConciergeBell },
    { label: 'Skills', value: stats.skills, icon: FaTasks },
    { label: 'PDFs / Resume', value: stats.documents, icon: FaFilePdf },
    { label: 'Downloads', value: stats.downloads, icon: FaDownload },
    { label: 'Testimonials', value: stats.testimonials, icon: FaQuoteLeft },
    { label: 'Messages', value: stats.messages, icon: FaEnvelope },
    { label: 'Unread', value: stats.unread, icon: FaEnvelopeOpenText },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-white mb-1">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-6">Site ka overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, live }) => (
          <div key={label} className="bg-surface border border-line p-4 sm:p-5 hover:border-gold/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Icon className="text-gold text-xl" />
              {live && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${value ? 'animate-ping' : 'hidden'}`} />
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${value ? 'bg-green-500' : 'bg-neutral-600'}`} />
                </span>
              )}
            </div>
            <p className="font-serif text-3xl text-white tabular-nums">{value}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Skills + Resume/PDF sections */}
      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <Panel title="Skills" icon={FaTasks} to="/admin/skills" linkLabel="Manage">
          {skills.length === 0 ? (
            <Empty text="Abhi koi skill add nahi hui." to="/admin/skills" label="Add skill" />
          ) : (
            <ul className="divide-y divide-line">
              {skills.slice(0, 6).map((s) => (
                <li key={s._id} className="px-4 sm:px-5 py-3">
                  <div className="flex items-center justify-between gap-3 text-sm mb-2">
                    <span className="text-neutral-200 truncate">
                      {s.name}
                      {!s.isActive && <span className="ml-2 text-[10px] text-neutral-500 border border-line px-1.5 py-0.5 uppercase">Hidden</span>}
                    </span>
                    <span className="text-gold text-xs tabular-nums shrink-0">{s.level}%</span>
                  </div>
                  <div className="h-1 bg-line">
                    <div className="h-full bg-gold" style={{ width: `${s.level}%` }} />
                  </div>
                </li>
              ))}
              {skills.length > 6 && (
                <li className="px-4 sm:px-5 py-3 text-xs text-neutral-500">+ {skills.length - 6} aur skills</li>
              )}
            </ul>
          )}
        </Panel>

        <Panel title="Resume & PDFs" icon={FaFilePdf} to="/admin/documents" linkLabel="Manage">
          {docs.length === 0 ? (
            <Empty text="Abhi koi PDF upload nahi hui." to="/admin/documents" label="Upload resume" />
          ) : (
            <ul className="divide-y divide-line">
              {docs.slice(0, 6).map((d) => (
                <li key={d._id} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-200 truncate">{d.title}</p>
                    <p className="text-xs mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-gold uppercase text-[10px] border border-gold/50 px-1.5 py-0.5">{DOC_TYPE_LABELS[d.type]}</span>
                      {d.isPrimary && <span className="text-black bg-gold uppercase text-[10px] px-1.5 py-0.5">Primary</span>}
                      {!d.isActive && <span className="text-neutral-500 uppercase text-[10px] border border-line px-1.5 py-0.5">Hidden</span>}
                    </p>
                  </div>
                  <div className="text-right text-xs text-neutral-400 shrink-0 space-y-1">
                    <p className="flex items-center justify-end gap-1"><FaDownload className="text-gold" /> {d.downloads || 0}</p>
                    <p className="flex items-center justify-end gap-1"><FaEye className="text-gold" /> {d.views || 0}</p>
                  </div>
                </li>
              ))}
              {docs.length > 6 && (
                <li className="px-4 sm:px-5 py-3 text-xs text-neutral-500">+ {docs.length - 6} aur files</li>
              )}
            </ul>
          )}
        </Panel>
      </div>

      <section className="mb-10">
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
      </section>

      {/* Full Monitor Activity section (same data as /admin/activity) */}
      <div className="border-t border-line pt-8">
        <ActivityMonitor embedded />
      </div>
    </div>
  );
};

export default Dashboard;