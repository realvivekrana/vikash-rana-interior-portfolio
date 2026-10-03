import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import SectionTitle from '../common/SectionTitle';
import Reveal from '../common/Reveal';

const Testimonials = () => {
  const { data: items, loading } = useFetch('/testimonials');
  if (loading || !items?.length) return null;

  const shown = items.slice(0, 6);

  return (
    <section className="bg-surface/50 border-y border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-28">
        <SectionTitle eyebrow="Testimonials" title="What Clients Say" />

        {/* Mobile: swipe karne wali row | Tablet+: grid */}
        <Reveal>
          <div className="-mx-5 px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-2">
            {shown.map((t) => (
              <figure
                key={t._id}
                className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-auto bg-ink border border-line p-6 sm:p-8 flex flex-col"
              >
                <FaQuoteLeft className="text-gold/60 text-2xl mb-5" />
                <blockquote className="text-neutral-300 text-sm leading-relaxed flex-1">{t.message}</blockquote>
                <div className="flex gap-1 text-gold text-xs mt-6" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, k) => <FaStar key={k} />)}
                </div>
                <figcaption className="flex items-center gap-3 mt-4">
                  {t.image?.url && (
                    <img
                      src={img(t.image.url, 120)}
                      alt={t.name}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    {t.designation && <p className="text-neutral-500 text-xs">{t.designation}</p>}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          {shown.length > 1 && (
            <p className="md:hidden text-center text-neutral-600 text-[11px] uppercase tracking-widest mt-4">
              Swipe →
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;