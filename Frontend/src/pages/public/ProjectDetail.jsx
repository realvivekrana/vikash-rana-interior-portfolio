import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaTimes, FaChevronLeft, FaChevronRight, FaShareAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import Loader from '../../components/common/Loader';
import Seo from '../../components/common/Seo';
import ProjectCard from '../../components/common/ProjectCard';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: project, loading, error } = useFetch(`/projects/${slug}`);
  const { data: all } = useFetch('/projects');
  const [lightbox, setLightbox] = useState(null);
  const touchX = useRef(null);

  const gallery = project
    ? project.images?.length
      ? project.images
      : project.coverImage
      ? [project.coverImage]
      : []
    : [];
  const count = gallery.length;

  const go = useCallback(
    (dir) => setLightbox((i) => (i === null ? i : (i + dir + count) % count)),
    [count]
  );

  // Keyboard: Esc / arrows. Lightbox khula ho to page scroll lock.
  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, go]);

  // Doosre project par jaane par lightbox band
  useEffect(() => setLightbox(null), [slug]);

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: project.title, text: `${project.title} - ${project.category}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied');
      }
    } catch {
      /* user ne share cancel kiya */
    }
  };

  if (loading) return <div className="pt-28 md:pt-36"><Loader /></div>;

  if (error || !project) {
    return (
      <div className="pt-36 pb-20 text-center px-6">
        <Seo title="Project not found" />
        <p className="text-neutral-400 mb-6">{error || 'Project not found'}</p>
        <Link to="/projects" className="text-gold text-xs uppercase tracking-[0.25em]">← Back to projects</Link>
      </div>
    );
  }

  const list = all || [];
  const idx = list.findIndex((p) => p._id === project._id);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const related = list.filter((p) => p._id !== project._id && p.category === project.category).slice(0, 3);

  const meta = [
    ['Category', project.category],
    ['Location', project.location],
    ['Area', project.area],
    ['Year', project.year],
    ['Client', project.client],
  ].filter(([, v]) => v);

  return (
    <article>
      <Seo
        title={project.title}
        description={project.description || `${project.title} - ${project.category} interior design project.`}
        image={project.coverImage?.url && img(project.coverImage.url, 1200)}
      />

      <div className="relative h-[55svh] md:h-[70vh]">
        {project.coverImage?.url && (
          <img
            src={img(project.coverImage.url, 1400)}
            srcSet={`${img(project.coverImage.url, 640)} 640w, ${img(project.coverImage.url, 1000)} 1000w, ${img(project.coverImage.url, 1600)} 1600w`}
            sizes="100vw"
            alt={project.title}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-5 md:px-8 pb-8 md:pb-10">
          <p className="text-gold tracking-[0.35em] text-xs uppercase mb-3">{project.category}</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white">{project.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-3 gap-10 lg:gap-12">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl text-white mb-4">About this project</h2>
          <div className="w-12 h-px bg-gold mb-6" />
          <p className="text-neutral-400 leading-relaxed whitespace-pre-line">
            {project.description || 'Details will be added soon.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to={`/contact?subject=${encodeURIComponent(`Enquiry: ${project.title}`)}`}
              className="bg-gold hover:bg-gold-light text-black px-8 min-h-12 inline-flex items-center justify-center text-xs uppercase tracking-[0.25em] transition-colors"
            >
              Enquire about a similar project
            </Link>
            <button
              onClick={share}
              className="border border-line text-neutral-300 hover:border-gold hover:text-gold px-8 min-h-12 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] transition-colors"
            >
              <FaShareAlt /> Share
            </button>
          </div>
        </div>

        {meta.length > 0 && (
          <div className="bg-surface border border-line p-5 sm:p-6 h-fit">
            {meta.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 border-b border-line last:border-0">
                <span className="text-neutral-500 text-xs uppercase tracking-wider">{k}</span>
                <span className="text-white text-sm text-right">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {count > 0 && (
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-10">
          <h2 className="font-serif text-2xl text-white mb-6 md:mb-8">Gallery</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
            {gallery.map((g, i) => (
              <button
                key={g.public_id}
                onClick={() => setLightbox(i)}
                className="block w-full overflow-hidden group"
                aria-label={`Open photo ${i + 1}`}
              >
                <img
                  src={img(g.url, 800)}
                  srcSet={`${img(g.url, 500)} 500w, ${img(g.url, 800)} 800w, ${img(g.url, 1100)} 1100w`}
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  alt={`${project.title} ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 border-t border-line mt-6">
          <h2 className="font-serif text-2xl text-white mb-6 md:mb-8">More {project.category} projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {related.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-2 gap-3 border-t border-line">
        {prev ? (
          <Link to={`/projects/${prev.slug}`} className="group min-h-14 flex items-center gap-3 text-left">
            <FaArrowLeft className="text-gold shrink-0" />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Previous</span>
              <span className="block font-serif text-white truncate group-hover:text-gold transition-colors">{prev.title}</span>
            </span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/projects/${next.slug}`} className="group min-h-14 flex items-center justify-end gap-3 text-right">
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Next</span>
              <span className="block font-serif text-white truncate group-hover:text-gold transition-colors">{next.title}</span>
            </span>
            <FaArrowRight className="text-gold shrink-0" />
          </Link>
        ) : <span />}
      </div>

      <div className="text-center pb-10">
        <Link to="/projects" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light inline-block py-3">
          ← All projects
        </Link>
      </div>

      {lightbox !== null && gallery[lightbox] && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-[calc(0.75rem+env(safe-area-inset-top))] right-3 h-11 w-11 flex items-center justify-center text-white text-2xl"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <FaTimes />
          </button>
          {count > 1 && (
            <>
              <button
                className="absolute left-1 md:left-8 h-12 w-12 flex items-center justify-center text-white text-2xl"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                aria-label="Previous photo"
              ><FaChevronLeft /></button>
              <button
                className="absolute right-1 md:right-8 h-12 w-12 flex items-center justify-center text-white text-2xl"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                aria-label="Next photo"
              ><FaChevronRight /></button>
              <p className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] text-xs text-neutral-400 tracking-widest">
                {lightbox + 1} / {count}
              </p>
            </>
          )}
          <img
            src={img(gallery[lightbox].url, 1600)}
            alt=""
            className="max-h-[85svh] max-w-[94vw] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </article>
  );
};

export default ProjectDetail;