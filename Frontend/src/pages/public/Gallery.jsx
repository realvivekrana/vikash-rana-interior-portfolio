import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import SectionTitle from '../../components/common/SectionTitle';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';
import Lightbox from '../../components/common/Lightbox';
import { outlineBtn } from '../../utils/ui';

const PAGE_SIZE = 12;

const Gallery = () => {
  const { data: items, loading, error } = useFetch('/gallery');
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [shown, setShown] = useState(PAGE_SIZE);

  const all = useMemo(() => items || [], [items]);
  const categories = useMemo(() => ['All', ...new Set(all.map((i) => i.category))], [all]);
  const wanted = params.get('category') || 'All';
  const active = categories.includes(wanted) ? wanted : 'All';
  const filtered = useMemo(
    () => (active === 'All' ? all : all.filter((i) => i.category === active)),
    [all, active]
  );
  const list = useMemo(
    () => filtered.map((i) => ({ url: i.image.url, title: i.title, category: i.category })),
    [filtered]
  );
  const count = list.length;

  const setActive = (c) => {
    setShown(PAGE_SIZE);
    // replace: filter badalne se back button ki history lambi na ho
    setParams(c === 'All' ? {} : { category: c }, { replace: true });
  };

  // Lightbox ka index history state mein: back button usse band karta hai, page se bahar nahi le jaata
  const lightbox = location.state?.lightbox ?? null;
  const here = `${location.pathname}${location.search}`;
  const open = (i) => navigate(here, { state: { lightbox: i } });
  const close = useCallback(() => navigate(-1), [navigate]);
  const go = useCallback(
    (dir) => {
      if (lightbox !== null && count > 0) {
        navigate(here, { replace: true, state: { lightbox: (lightbox + dir + count) % count } });
      }
    },
    [lightbox, count, navigate, here]
  );

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo
        title="Gallery"
        description="A visual gallery of our interior design work: living rooms, bedrooms, kitchens and more."
        image={all[0]?.image?.url && img(all[0].image.url, 1200)}
      />
      <SectionTitle eyebrow="Gallery" title="Moments in Design" subtitle="A closer look at the spaces we have shaped." />

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-center text-neutral-500">{error}</p>
      ) : (
        <>
          {categories.length > 2 && (
            <div className="-mx-5 px-5 sm:mx-0 sm:px-0 flex sm:flex-wrap sm:justify-center gap-3 mb-10 md:mb-12 overflow-x-auto sm:overflow-visible no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`shrink-0 px-5 min-h-11 text-xs uppercase tracking-[0.2em] border transition-colors ${
                    active === c
                      ? 'bg-gold text-black border-gold'
                      : 'border-line text-neutral-400 hover:border-gold hover:text-gold'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {count === 0 ? (
            <p className="text-center text-neutral-500">No photos to show yet.</p>
          ) : (
            <>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
                {filtered.slice(0, shown).map((g, i) => (
                  <Reveal key={g._id}>
                    <button
                      onClick={() => open(i)}
                      className="relative block w-full overflow-hidden group bg-surface"
                      aria-label={`Open photo: ${g.title || g.category}`}
                    >
                      <img
                        src={img(g.image.url, 600)}
                        srcSet={`${img(g.image.url, 400)} 400w, ${img(g.image.url, 700)} 700w, ${img(g.image.url, 1000)} 1000w`}
                        sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                        alt={g.title || g.category}
                        loading="lazy"
                        decoding="async"
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                        {g.title && <span className="block font-serif text-white text-sm truncate">{g.title}</span>}
                        <span className="block text-[10px] uppercase tracking-widest text-gold">{g.category}</span>
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>

              {shown < count && (
                <div className="text-center mt-10">
                  <button onClick={() => setShown((n) => n + PAGE_SIZE)} className={outlineBtn}>
                    Load more ({count - shown} more)
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {lightbox !== null && list[lightbox] && (
        <Lightbox items={list} index={lightbox} onClose={close} onGo={go} />
      )}
    </section>
  );
};

export default Gallery;