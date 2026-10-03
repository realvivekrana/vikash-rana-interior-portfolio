import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash, FaEnvelope, FaPhoneAlt, FaWhatsapp, FaEnvelopeOpen, FaSearch, FaCheckDouble } from 'react-icons/fa';
import api from '../../api/axios';
import PageHeader from '../../components/admin/PageHeader';
import { inputClass, outlineBtn } from '../../utils/ui';

const waNumber = (p) => {
  const d = p.replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

const Messages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .get('/messages')
      .then((res) => setItems(res.data.data))
      .catch(() => toast.error('Messages load nahi hue'))
      .finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id) => {
    try {
      const { data } = await api.patch(`/messages/${id}/read`);
      setItems((list) => list.map((m) => (m._id === id ? data.data : m)));
    } catch {
      toast.error('Update nahi hua');
    }
  };

  const open = (m) => {
    const willOpen = openId !== m._id;
    setOpenId(willOpen ? m._id : null);
    if (willOpen && !m.isRead) toggleRead(m._id);
  };

  const remove = async (m) => {
    if (!window.confirm(`${m.name} ka message delete karna hai?`)) return;
    try {
      await api.delete(`/messages/${m._id}`);
      setItems((list) => list.filter((i) => i._id !== m._id));
      toast.success('Message deleted');
    } catch {
      toast.error('Delete nahi hua');
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/messages/read-all');
      setItems((list) => list.map((m) => ({ ...m, isRead: true })));
      toast.success('All messages marked as read');
    } catch {
      toast.error('Update nahi hua');
    }
  };

  const unread = items.filter((m) => !m.isRead).length;

  const q = query.trim().toLowerCase();
  const visible = items.filter((m) => {
    if (filter === 'unread' && m.isRead) return false;
    if (!q) return true;
    return [m.name, m.email, m.phone, m.subject, m.message].some((v) => (v || '').toLowerCase().includes(q));
  });

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Messages"
        subtitle={`${items.length} total, ${unread} unread`}
        action={
          unread > 0 && (
            <button onClick={markAllRead} className={outlineBtn}>
              <FaCheckDouble /> Mark all read
            </button>
          )
        }
      />

      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 text-sm" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, message..."
              className={`${inputClass} pl-10 min-h-11`}
            />
          </div>
          <div className="flex">
            {[['all', 'All'], ['unread', `Unread (${unread})`]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 sm:flex-none min-h-11 px-5 text-xs uppercase tracking-wider border transition-colors ${
                  filter === key ? 'bg-gold text-black border-gold' : 'border-line text-neutral-400 hover:border-gold hover:text-gold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">
          Abhi koi message nahi aaya.
        </div>
      ) : visible.length === 0 ? (
        <div className="border border-dashed border-line p-10 text-center text-neutral-500">
          No messages match your search.
        </div>
      ) : (
        <div className="bg-surface border border-line divide-y divide-line">
          {visible.map((m) => (
            <div key={m._id}>
              <button
                onClick={() => open(m)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className={`text-sm ${m.isRead ? 'text-neutral-300' : 'text-white font-semibold'}`}>
                    {m.name}
                    {!m.isRead && (
                      <span className="ml-2 text-[10px] text-gold border border-gold px-1.5 py-0.5">NEW</span>
                    )}
                  </p>
                  <p className="text-neutral-500 text-sm truncate mt-0.5">
                    {m.subject ? `${m.subject} - ` : ''}
                    {m.message}
                  </p>
                </div>
                <span className="text-neutral-600 text-xs whitespace-nowrap">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </button>

              {openId === m._id && (
                <div className="px-4 sm:px-5 pb-6 border-t border-line/60 bg-ink/40">
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line pt-5">{m.message}</p>

                  <div className="mt-5 text-xs text-neutral-500 space-y-1">
                    <p>Email: <span className="text-neutral-300">{m.email}</span></p>
                    {m.phone && <p>Phone: <span className="text-neutral-300">{m.phone}</span></p>}
                    <p>Received: {new Date(m.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <a
                      href={`mailto:${m.email}`}
                      className="min-h-11 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                    >
                      <FaEnvelope /> Reply
                    </a>
                    {m.phone && (
                      <>
                        <a
                          href={`tel:${m.phone}`}
                          className="min-h-11 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                        >
                          <FaPhoneAlt /> Call
                        </a>
                        <a
                          href={`https://wa.me/${waNumber(m.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-11 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => toggleRead(m._id)}
                      className="min-h-11 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                    >
                      <FaEnvelopeOpen /> Mark {m.isRead ? 'unread' : 'read'}
                    </button>
                    <button
                      onClick={() => remove(m)}
                      className="min-h-11 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-red-500 hover:text-red-400"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;