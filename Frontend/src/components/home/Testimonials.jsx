import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import SectionTitle from '../common/SectionTitle';
import Reveal from '../common/Reveal';

const Testimonials = () => {
  const { data: items, loading } = useFetch('/testimonials');
  if (loading || !items?.length) return null;

  return (
    <section className="bg-surface/50 border-y border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <SectionTitle eyebrow="Testimonials" title="What Clients Say" />
        <div className="grid md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((t, i) => (
            <Reveal key={t._id} delay={i * 0.1}>
              <div className="bg-ink border border-line p-8 h-full flex flex-col">
                <FaQuoteLeft className="text-gold/60 text-2xl mb-5" />
                <p className="text-neutral-300 text-sm leading-relaxed flex-1">{t.message}</p>
                <div className="flex gap-1 text-gold text-xs mt-6">
                  {Array.from({ length: t.rating }).map((_, k) => <FaStar key={k} />)}
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {t.image?.url && (
                    <img src={img(t.image.url, 120)} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    {t.designation && <p className="text-neutral-500 text-xs">{t.designation}</p>}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;