import { useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../../components/common/SectionTitle';
import ProjectCard from '../../components/common/ProjectCard';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';

const Projects = () => {
  const { data: projects, loading } = useFetch('/projects');
  const [params, setParams] = useSearchParams();

  const categories = ['All', ...new Set((projects || []).map((p) => p.category))];
  const wanted = params.get('category') || 'All';
  const active = categories.includes(wanted) ? wanted : 'All';
  // replace: filter badalne se back button ki history lambi na ho
  const setActive = (c) => setParams(c === 'All' ? {} : { category: c }, { replace: true });
  const filtered = active === 'All' ? projects || [] : (projects || []).filter((p) => p.category === active);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="Projects" description="Explore our interior design portfolio: living rooms, bedrooms, kitchens and offices." />
      <SectionTitle eyebrow="Portfolio" title="Our Projects" subtitle="Every space tells a story. Explore ours." />

      {loading ? (
        <Loader />
      ) : (
        <>
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

          {filtered.length === 0 ? (
            <p className="text-center text-neutral-500">No projects to show yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <Reveal key={p._id} delay={(i % 3) * 0.08}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Projects;