import { Link } from 'react-router-dom';
import { img } from '../../utils/img';

const ProjectCard = ({ project }) => (
  <Link
    to={`/projects/${project.slug}`}
    className="group relative block overflow-hidden bg-surface aspect-[4/5]"
  >
    {project.coverImage?.url ? (
      <img
        src={img(project.coverImage.url, 700)}
        srcSet={`${img(project.coverImage.url, 400)} 400w, ${img(project.coverImage.url, 700)} 700w, ${img(project.coverImage.url, 1000)} 1000w`}
        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    ) : (
      <div className="h-full w-full flex items-center justify-center text-neutral-700 font-serif text-xl">
        No image
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
      <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">{project.category}</p>
      <h3 className="font-serif text-xl text-white">{project.title}</h3>
      {/* Touch screen par hamesha dikhe, mouse wale device par hover par */}
      <p className="text-gold-light text-xs mt-2 transition-all duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0">
        View Project →
      </p>
    </div>
  </Link>
);

export default ProjectCard;