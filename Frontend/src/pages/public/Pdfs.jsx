import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Seo from '../../components/common/Seo';
import SectionTitle from '../../components/common/SectionTitle';
import DocumentCard from '../../components/common/DocumentCard';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';
import { DOC_TYPE_LABELS } from '../../utils/format';

const Pdfs = () => {
  const { data, loading } = useFetch('/documents');
  const [type, setType] = useState('all');

  // Resume alag page par hai, yahan baaki PDFs
  const docs = (data || []).filter((d) => d.type !== 'resume');
  const types = [...new Set(docs.map((d) => d.type))];
  const shown = type === 'all' ? docs : docs.filter((d) => d.type === type);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="PDF Downloads" description="Portfolio, brochures and other downloadable PDFs." />
      <SectionTitle eyebrow="Downloads" title="PDFs" subtitle="Portfolio decks, brochures and more. View online or save a copy." />

      {types.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:justify-center mb-10">
          {['all', ...types].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`shrink-0 min-h-11 px-5 text-xs uppercase tracking-[0.15em] border transition-colors ${
                type === t ? 'border-gold text-gold bg-gold/10' : 'border-line text-neutral-400 hover:border-gold/60'
              }`}
            >
              {t === 'all' ? 'All' : DOC_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : !shown.length ? (
        <p className="text-center text-neutral-500">PDFs will be added soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((d, i) => (
            <Reveal key={d._id} delay={(i % 3) * 0.1}>
              <DocumentCard doc={d} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};

export default Pdfs;