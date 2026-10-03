import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';
import Loader from '../../components/common/Loader';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: project, loading, error } = useFetch(`/projects/${slug}`);
  const [lightbox, setLightbox] = useState(null);

  const gallery = project
    ? project.images?.length
      ? project.images
      : project.coverImage
      ? [project.coverImage]
      : []
    : [];

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, gallery.length]);

  if (loading) return <div className="pt-36"><Loader /></div>;

  if (error || !project) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-neutral-400 mb-6">{error || 'Project not found'}</p>
        <Link to="/projects" className="text-gold text-xs uppercase tracking-[0.25em]">← Back to projects</Link>
      </div>
    );
  }

  const meta = [
    ['Category', project.category],
    ['Location', project.location],
    ['Area', project.area],
    ['Year', project.year],
    ['Client', project.client],
  ].filter(([, v]) => v);

  return (
    <article>
      <div className="relative h-[60vh] md:h-[70vh]">
        {project.coverImage?.url && (
          <img src={img(project.coverImage.url, 2000)} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-5 md:px-8 pb-10">
          <p className="text-gold tracking-[0.35em] text-xs uppercase mb-3">{project.category}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white">{project.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl text-white mb-4">About this project</h2>
          <div className="w-12 h-px bg-gold mb-6" />
          <p className="text-neutral-400 leading-relaxed whitespace-pre-line">
            {project.description || 'Details jald hi add kiye jayenge.'}
          </p>
        </div>
        {meta.length > 0 && (
          <div className="bg-surface border border-line p-6 h-fit">
            {meta.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 border-b border-line last:border-0">
                <span className="text-neutral-500 text-xs uppercase tracking-wider">{k}</span>
                <span className="text-white text-sm text-right">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-10">
          <h2 className="font-serif text-2xl text-white mb-8">Gallery</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
            {gallery.map((g, i) => (
              <button key={g.public_id} onClick={() => setLightbox(i)} className="block w-full overflow-hidden group">
                <img
                  src={img(g.url, 900)}
                  alt={`${project.title} ${i + 1}`}
                  loading="lazy"
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center py-10">
        <Link to="/projects" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light">
          ← All projects
        </Link>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white text-2xl" onClick={() => setLightbox(null)}><FaTimes /></button>
          {gallery.length > 1 && (
            <>
              <button
                className="absolute left-3 md:left-8 text-white text-2xl p-3"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}
              ><FaChevronLeft /></button>
              <button
                className="absolute right-3 md:right-8 text-white text-2xl p-3"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}
              ><FaChevronRight /></button>
            </>
          )}
          <img
            src={img(gallery[lightbox].url, 1800)}
            alt=""
            className="max-h-[88vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
};

export default ProjectDetail;