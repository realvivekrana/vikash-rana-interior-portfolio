import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';
import Testimonials from '../../components/home/Testimonials';

const About = () => {
  const { data: about, loading } = useFetch('/about');

  if (loading) return <div className="pt-28 md:pt-36"><Loader /></div>;

  return (
    <>
      <Seo
        title="About"
        description={about?.bio}
        image={about?.photo?.url && img(about.photo.url, 1200)}
      />
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-16 md:pb-20 grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <Reveal>
          {about?.photo?.url ? (
            <img src={img(about.photo.url, 1000)} alt={about.name} className="w-full aspect-[4/5] object-cover" />
          ) : (
            <div className="w-full aspect-[4/5] bg-surface border border-line" />
          )}
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-gold tracking-[0.35em] text-xs uppercase mb-3">About</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white">{about?.name}</h1>
          <p className="text-gold-light mt-3">{about?.title}</p>
          <div className="w-14 h-px bg-gold my-7" />
          <p className="text-neutral-400 leading-loose whitespace-pre-line">
            {about?.bio || 'Our story is coming soon.'}
          </p>

          {about?.stats?.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 pt-8 border-t border-line">
              {about.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-3xl sm:text-4xl text-gold">{s.value}</p>
                  <p className="text-neutral-500 text-[11px] uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/contact"
            className="inline-block mt-10 border border-gold text-gold hover:bg-gold hover:text-black px-9 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors"
          >
            Let's Talk
          </Link>
        </Reveal>
      </section>

      <Testimonials />
    </>
  );
};

export default About;