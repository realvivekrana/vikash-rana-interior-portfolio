import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMagic, FaPalette, FaCalculator, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import api from '../../api/axios';
import useFetch from '../../hooks/useFetch';
import { inputClass, labelClass, goldBtn } from '../../utils/ui';
import Seo from '../../components/common/Seo';
import SectionTitle from '../../components/common/SectionTitle';
import Reveal from '../../components/common/Reveal';

const ROOMS = ['Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Home Office', 'Bathroom', 'Kids Room', 'Full Home'];
const STYLES = ['Modern', 'Minimalist', 'Contemporary', 'Traditional Indian', 'Scandinavian', 'Industrial', 'Boho', 'Luxury'];
const TIERS = ['Economy', 'Standard', 'Premium'];

const TOOLS = [
  { id: 'style', label: 'Style Ideas', icon: FaMagic, blurb: 'Get design ideas, furniture picks and tips for your room.', fields: ['room', 'style', 'mood', 'notes'] },
  { id: 'palette', label: 'Colour Palette', icon: FaPalette, blurb: 'A ready colour scheme with where to use each shade.', fields: ['room', 'style', 'mood'] },
  { id: 'budget', label: 'Budget Estimate', icon: FaCalculator, blurb: 'A rough interior budget in rupees, item by item.', fields: ['room', 'area', 'tier', 'notes'] },
];

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const Results = ({ tool, data, input }) => {
  if (tool === 'style') {
    return (
      <div className="space-y-6">
        {data.summary && <p className="text-neutral-300 leading-relaxed">{data.summary}</p>}
        <div className="grid sm:grid-cols-2 gap-4">
          {data.ideas.map((x, i) => (
            <div key={i} className="border border-line bg-ink p-4">
              <h4 className="font-serif text-white mb-1">{x.title}</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">{x.description}</p>
            </div>
          ))}
        </div>
        {data.furniture.length > 0 && (
          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.25em] mb-3">Furniture picks</h4>
            <div className="flex flex-wrap gap-2">
              {data.furniture.map((f, i) => (
                <span key={i} className="border border-line text-neutral-300 text-sm px-3 py-1.5">{f}</span>
              ))}
            </div>
          </div>
        )}
        {data.tips.length > 0 && (
          <ul className="space-y-2">
            {data.tips.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm text-neutral-400"><FaCheck className="text-gold mt-1 shrink-0" />{t}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (tool === 'palette') {
    return (
      <div className="space-y-5">
        {data.name && <h3 className="font-serif text-2xl text-white">{data.name}</h3>}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {data.colors.map((c, i) => (
            <div key={i} className="border border-line">
              <div className="h-20 sm:h-24" style={{ backgroundColor: c.hex }} />
              <div className="p-2.5">
                <p className="text-white text-sm truncate">{c.name}</p>
                <p className="text-gold text-xs uppercase">{c.hex}</p>
                <p className="text-neutral-500 text-xs mt-1">{c.usage}</p>
              </div>
            </div>
          ))}
        </div>
        {data.tip && <p className="text-neutral-400 text-sm">{data.tip}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Estimated total for {input.room}</p>
        <p className="font-serif text-3xl sm:text-4xl text-gold">{inr(data.totalMin)} – {inr(data.totalMax)}</p>
      </div>
      <div className="border border-line divide-y divide-line">
        {data.breakdown.map((b, i) => (
          <div key={i} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <span className="text-neutral-300">{b.item}</span>
            <span className="text-white tabular-nums text-right">{inr(b.min)} – {inr(b.max)}</span>
          </div>
        ))}
      </div>
      {data.notes.length > 0 && (
        <ul className="space-y-2">
          {data.notes.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm text-neutral-400"><FaCheck className="text-gold mt-1 shrink-0" />{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AiTools = () => {
  const { data: showcase } = useFetch('/ai-tools');
  const [tool, setTool] = useState('style');
  const [form, setForm] = useState({ room: 'Living Room', style: 'Modern', mood: '', notes: '', area: 150, tier: 'Standard' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { tool, data, input }

  const active = TOOLS.find((t) => t.id === tool);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickTool = (id) => {
    setTool(id);
    setError('');
    setResult(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/generate', { tool, ...form });
      setResult({ tool, data: data.data, input: { ...form } });
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groups = [];
  (showcase || []).forEach((t) => {
    const name = t.category || 'Other';
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, items: [] }));
    g.items.push(t);
  });

  const has = (f) => active.fields.includes(f);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="AI Tools" description="Free AI design assistant: room style ideas, colour palettes and budget estimates." />
      <SectionTitle eyebrow="AI Design Assistant" title="Plan Your Space with AI" subtitle="Try our free tools to get ideas, colours and a rough budget in seconds." />

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {TOOLS.map(({ id, label, icon: Icon, blurb }) => (
          <button
            key={id}
            onClick={() => pickTool(id)}
            aria-pressed={tool === id}
            className={`text-left p-4 sm:p-5 border transition-colors min-h-11 ${
              tool === id ? 'border-gold bg-gold/5' : 'border-line bg-surface hover:border-gold/60'
            }`}
          >
            <Icon className="text-gold text-lg mb-2" />
            <p className="font-serif text-white">{label}</p>
            <p className="text-neutral-500 text-xs mt-1">{blurb}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        <form onSubmit={submit} className="lg:col-span-2 bg-surface border border-line p-5 sm:p-6 space-y-5">
          <div>
            <label className={labelClass}>Room</label>
            <select className={inputClass} value={form.room} onChange={set('room')}>
              {ROOMS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          {has('style') && (
            <div>
              <label className={labelClass}>Style</label>
              <select className={inputClass} value={form.style} onChange={set('style')}>
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          {has('area') && (
            <div>
              <label className={labelClass}>Area (sq ft)</label>
              <input type="number" inputMode="numeric" min="20" max="10000" required className={inputClass} value={form.area} onChange={set('area')} />
            </div>
          )}
          {has('tier') && (
            <div>
              <label className={labelClass}>Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, tier: t }))}
                    className={`min-h-11 text-xs uppercase tracking-wider border transition-colors ${
                      form.tier === t ? 'bg-gold text-black border-gold' : 'border-line text-neutral-300 hover:border-gold'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {has('mood') && (
            <div>
              <label className={labelClass}>Mood (optional)</label>
              <input className={inputClass} maxLength={80} placeholder="Calm, warm, cosy" value={form.mood} onChange={set('mood')} />
            </div>
          )}
          {has('notes') && (
            <div>
              <label className={labelClass}>Anything else? (optional)</label>
              <input className={inputClass} maxLength={200} placeholder="Small room, lots of storage needed" value={form.notes} onChange={set('notes')} />
            </div>
          )}
          <button type="submit" disabled={loading} className={`${goldBtn} w-full`}>
            {loading ? 'Thinking...' : `Generate ${active.label}`}
          </button>
        </form>

        <div className="lg:col-span-3 bg-surface border border-line p-5 sm:p-6 min-h-64" aria-live="polite">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16" role="status">
              <div className="h-10 w-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
              <p className="text-neutral-500 text-sm">Designing your ideas...</p>
            </div>
          ) : error ? (
            <p className="text-red-400 text-sm py-8 text-center">{error}</p>
          ) : result ? (
            <>
              <Results tool={result.tool} data={result.data} input={result.input} />
              <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-neutral-600 text-xs max-w-md">
                  AI suggestions are a starting point only. Final design and cost depend on site visit and material choices.
                </p>
                <Link
                  to={`/contact?subject=${encodeURIComponent(`Enquiry: ${result.input.room} (${TOOLS.find((t) => t.id === result.tool).label})`)}`}
                  className={`${goldBtn} shrink-0`}
                >
                  Discuss with our designer
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-16 text-neutral-500">
              <active.icon className="text-3xl text-gold/60" />
              <p className="text-sm max-w-xs">Choose your options and tap Generate. Your result will show up here.</p>
            </div>
          )}
        </div>
      </div>

      {groups.length > 0 && (
        <div className="mt-20">
          <SectionTitle eyebrow="Behind the scenes" title="AI Tools We Use" subtitle="The tools that help us visualise, plan and deliver faster." />
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.name}>
                <h3 className="text-gold text-xs uppercase tracking-[0.3em] mb-4">{g.name}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {g.items.map((t, i) => (
                    <Reveal key={t._id} delay={(i % 3) * 0.08}>
                      <div className="bg-surface border border-line p-5 h-full">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-serif text-lg text-white break-words">{t.name}</h4>
                          {t.url && (
                            <a href={t.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${t.name}`} className="h-11 w-11 -mt-2 -mr-2 flex items-center justify-center text-neutral-400 hover:text-gold shrink-0">
                              <FaExternalLinkAlt className="text-sm" />
                            </a>
                          )}
                        </div>
                        {t.description && <p className="text-neutral-400 text-sm mt-2 leading-relaxed">{t.description}</p>}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AiTools;