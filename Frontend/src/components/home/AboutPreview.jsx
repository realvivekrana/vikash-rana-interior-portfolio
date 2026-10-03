import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import Reveal from '../common/Reveal';

const AboutPreview = () => {
  const { data: about, loading } = useFetch('/about');
  if (loading || !about || (!about.bio && !about.photo?.url)) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-28 grid md:grid-cols-2 gap-12 items-center">
      <Reveal>
        <div className="relative">
          {about.photo?.url ? (
            <img
              src={img(about.photo.url, 800)}
              alt={about.name}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
          ) : (
            <div className="w-full aspect-[4/5] bg-surface" />
          )}
          <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-gold/40 -z-10 hidden md:block" />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="text-gold tracking-[0.35em] text-xs uppercase mb-3">About</p>
        <h2 className="font-serif text-3xl md:text-5xl text-white">{about.name}</h2>
        <p className="text-gold-light mt-2 text-sm">{about.title}</p>
        <div className="w-14 h-px bg-gold my-6" />
        <p className="text-neutral-400 leading-relaxed line-clamp-6 whitespace-pre-line">{about.bio}</p>

        {about.stats?.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {about.stats.map((st) => (
              <div key={st.label}>
                <p className="font-serif text-3xl text-gold">{st.value}</p>
                <p className="text-neutral-500 text-[11px] uppercase tracking-wider mt-1">{st.label}</p>
              </div>
            ))}
          </div>
        )}

        <Link to="/about" className="inline-block mt-8 text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light">
          Read my story →
        </Link>
      </Reveal>
    </section>
  );
};

export default AboutPreview;