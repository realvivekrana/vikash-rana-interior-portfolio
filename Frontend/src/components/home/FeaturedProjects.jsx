import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../common/SectionTitle';
import ProjectCard from '../common/ProjectCard';
import Reveal from '../common/Reveal';

const FeaturedProjects = () => {
  const { data: projects, loading } = useFetch('/projects?featured=true');
  if (loading || !projects?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-28">
      <SectionTitle eyebrow="Portfolio" title="Featured Projects" subtitle="A glimpse of spaces we have transformed." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 6).map((p, i) => (
          <Reveal key={p._id} delay={(i % 3) * 0.1}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          to="/projects"
          className="inline-flex items-center justify-center min-h-12 border border-gold text-gold hover:bg-gold hover:text-black px-9 text-xs uppercase tracking-[0.25em] transition-colors"
        >
          View All Projects
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProjects;