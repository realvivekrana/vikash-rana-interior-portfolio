import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../../components/common/SectionTitle';
import ServiceCard from '../../components/common/ServiceCard';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import Reveal from '../../components/common/Reveal';

const Services = () => {
  const { data: services, loading } = useFetch('/services');

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="Our Services" description="Residential, commercial and turnkey interior design services." />
      <SectionTitle eyebrow="What We Do" title="Our Services" subtitle="From first sketch to final styling, we handle everything." />

      {loading ? (
        <Loader />
      ) : !services?.length ? (
        <p className="text-center text-neutral-500">Services will be added soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Reveal key={s._id} delay={(i % 3) * 0.1}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="text-center mt-16">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center min-h-12 bg-gold hover:bg-gold-light text-black px-9 text-xs uppercase tracking-[0.25em] transition-colors"
        >
          Start Your Project
        </Link>
      </div>
    </section>
  );
};

export default Services;