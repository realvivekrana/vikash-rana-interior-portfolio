import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';

const Hero = () => {
  const { data: hero } = useFetch('/hero');
  const bg = hero?.backgroundImage?.url;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {bg ? (
        <img src={img(bg, 2000)} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-ink to-black" />
      )}
      <div className="absolute inset-0 bg-black/60" />

      {hero && (
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gold tracking-[0.5em] text-xs uppercase mb-6"
          >
            Interior Designer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl text-white leading-tight"
          >
            {hero.heading}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-20 h-px bg-gold mx-auto my-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-neutral-300 text-base md:text-lg max-w-2xl mx-auto"
          >
            {hero.subheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to={hero.ctaLink || '/projects'}
              className="inline-block mt-10 border border-gold text-gold hover:bg-gold hover:text-black px-9 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors"
            >
              {hero.ctaText || 'View Projects'}
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Hero;