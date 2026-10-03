import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../common/SectionTitle';
import ServiceCard from '../common/ServiceCard';
import Reveal from '../common/Reveal';

const ServicesSection = () => {
  const { data: services, loading } = useFetch('/services');
  if (loading || !services?.length) return null;

  return (
    <section className="bg-surface/50 border-y border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <SectionTitle eyebrow="What We Do" title="Our Services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((s, i) => (
            <Reveal key={s._id} delay={(i % 3) * 0.1}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/services" className="text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-light">
            Explore all services →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;