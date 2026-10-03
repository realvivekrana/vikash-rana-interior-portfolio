import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../common/SectionTitle';
import SkillBar from '../common/SkillBar';
import Reveal from '../common/Reveal';

const SkillsSection = () => {
  const { data: skills, loading } = useFetch('/skills');
  if (loading || !skills?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-28">
      <SectionTitle eyebrow="Expertise" title="Skills & Tools" />
      <Reveal>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
          {skills.slice(0, 6).map((s) => (
            <SkillBar key={s._id} name={s.name} level={s.level} />
          ))}
        </div>
      </Reveal>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12">
        <Link to="/skills" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light py-2">
          All skills →
        </Link>
        <Link to="/resume" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light py-2">
          View resume →
        </Link>
      </div>
    </section>
  );
};

export default SkillsSection;