import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFetch from '../../hooks/useFetch';
import { img } from '../../utils/img';

const Hero = () => {
  const { data: hero } = useFetch('/hero');
  const bg = hero?.backgroundImage?.url;

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {bg ? (
        <img
          src={img(bg, 1400)}
          srcSet={`${img(bg, 640)} 640w, ${img(bg, 1000)} 1000w, ${img(bg, 1400)} 1400w, ${img(bg, 2000)} 2000w`}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
            className="text-gold tracking-[0.35em] sm:tracking-[0.5em] text-[11px] sm:text-xs uppercase mb-5 sm:mb-6"
          >
            {hero.eyebrow || 'Interior Designer'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-serif text-[2rem] leading-[1.15] sm:text-5xl md:text-7xl text-white sm:leading-tight"
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
              className="inline-flex items-center justify-center min-h-12 mt-9 sm:mt-10 border border-gold text-gold hover:bg-gold hover:text-black px-9 text-xs uppercase tracking-[0.25em] transition-colors"
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