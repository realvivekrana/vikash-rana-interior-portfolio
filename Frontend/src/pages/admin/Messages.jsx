import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash, FaEnvelope, FaPhoneAlt, FaWhatsapp, FaEnvelopeOpen } from 'react-icons/fa';
import api from '../../api/axios';
import PageHeader from '../../components/admin/PageHeader';

const waNumber = (p) => {
  const d = p.replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

const Messages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

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

  const unread = items.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-4xl">
      <PageHeader title="Messages" subtitle={`${items.length} total, ${unread} unread`} />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">
          Abhi koi message nahi aaya.
        </div>
      ) : (
        <div className="bg-surface border border-line divide-y divide-line">
          {items.map((m) => (
            <div key={m._id}>
              <button
                onClick={() => open(m)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-white/[0.02]"
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
                <div className="px-5 pb-6 border-t border-line/60 bg-ink/40">
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line pt-5">{m.message}</p>

                  <div className="mt-5 text-xs text-neutral-500 space-y-1">
                    <p>Email: <span className="text-neutral-300">{m.email}</span></p>
                    {m.phone && <p>Phone: <span className="text-neutral-300">{m.phone}</span></p>}
                    <p>Received: {new Date(m.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <a
                      href={`mailto:${m.email}`}
                      className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                    >
                      <FaEnvelope /> Reply
                    </a>
                    {m.phone && (
                      <>
                        <a
                          href={`tel:${m.phone}`}
                          className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                        >
                          <FaPhoneAlt /> Call
                        </a>
                        <a
                          href={`https://wa.me/${waNumber(m.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => toggleRead(m._id)}
                      className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                    >
                      <FaEnvelopeOpen /> Mark {m.isRead ? 'unread' : 'read'}
                    </button>
                    <button
                      onClick={() => remove(m)}
                      className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-red-500 hover:text-red-400"
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