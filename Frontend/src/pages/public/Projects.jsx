import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../../components/common/SectionTitle';
import ProjectCard from '../../components/common/ProjectCard';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';

const Projects = () => {
  const { data: projects, loading } = useFetch('/projects');
  const [active, setActive] = useState('All');

  const categories = ['All', ...new Set((projects || []).map((p) => p.category))];
  const filtered = active === 'All' ? projects || [] : (projects || []).filter((p) => p.category === active);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-36 pb-10">
      <SectionTitle eyebrow="Portfolio" title="Our Projects" subtitle="Every space tells a story. Explore ours." />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
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
            <p className="text-center text-neutral-500">Abhi koi project nahi hai.</p>
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