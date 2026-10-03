import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Seo from '../../components/common/Seo';
import SectionTitle from '../../components/common/SectionTitle';
import SkillBar from '../../components/common/SkillBar';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';

const Skills = () => {
  const { data: skills, loading } = useFetch('/skills');

  // Category ke hisaab se group (order wahi jo admin ne rakha)
  const groups = [];
  (skills || []).forEach((s) => {
    const name = s.category || 'Other';
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, items: [] }));
    g.items.push(s);
  });

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="Skills" description="Design, software and execution skills." />
      <SectionTitle eyebrow="Expertise" title="Skills & Tools" subtitle="Design thinking, software and on-site execution, all under one roof." />

      {loading ? (
        <Loader />
      ) : !groups.length ? (
        <p className="text-center text-neutral-500">Skills will be added soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g, i) => (
            <Reveal key={g.name} delay={(i % 3) * 0.1}>
              <div className="bg-surface border border-line p-6 sm:p-8 h-full">
                <h3 className="font-serif text-xl text-white mb-1">{g.name}</h3>
                <div className="w-10 h-px bg-gold mb-6" />
                <div className="space-y-5">
                  {g.items.map((s) => (
                    <SkillBar key={s._id} name={s.name} level={s.level} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <div className="text-center mt-14">
        <Link
          to="/resume"
          className="inline-flex items-center justify-center min-h-12 border border-gold text-gold hover:bg-gold hover:text-black px-9 text-xs uppercase tracking-[0.25em] transition-colors"
        >
          View Resume
        </Link>
      </div>
    </section>
  );
};

export default Skills;