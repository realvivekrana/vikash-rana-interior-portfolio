import { useEffect, useState } from 'react';
import { FaImages, FaStar, FaConciergeBell, FaQuoteLeft, FaEnvelope, FaEnvelopeOpenText } from 'react-icons/fa';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Stats load nahi hue. Backend chal raha hai?'));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-neutral-500">Loading...</p>;

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FaImages },
    { label: 'Featured', value: stats.featured, icon: FaStar },
    { label: 'Services', value: stats.services, icon: FaConciergeBell },
    { label: 'Testimonials', value: stats.testimonials, icon: FaQuoteLeft },
    { label: 'Messages', value: stats.messages, icon: FaEnvelope },
    { label: 'Unread', value: stats.unread, icon: FaEnvelopeOpenText },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-white mb-1">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-8">Site ka overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface border border-line p-5 md:p-6 hover:border-gold/50 transition-colors">
            <Icon className="text-gold text-xl mb-4" />
            <p className="font-serif text-3xl text-white">{value}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-xl text-white mb-4">Recent Messages</h2>
      <div className="bg-surface border border-line divide-y divide-line">
        {stats.recentMessages.length === 0 && (
          <p className="p-5 text-neutral-500 text-sm">Abhi koi message nahi aaya.</p>
        )}
        {stats.recentMessages.map((m) => (
          <div key={m._id} className="p-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-white text-sm font-medium">
                {m.name}
                {!m.isRead && <span className="ml-2 text-[10px] text-gold border border-gold px-1.5 py-0.5">NEW</span>}
              </p>
              <p className="text-neutral-500 text-sm truncate">{m.message}</p>
            </div>
            <span className="text-neutral-600 text-xs whitespace-nowrap">
              {new Date(m.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;