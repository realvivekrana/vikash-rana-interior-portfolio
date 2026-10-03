import { motion } from 'framer-motion';

const SkillBar = ({ name, level }) => (
  <div>
    <div className="flex items-baseline justify-between gap-3 text-sm mb-2">
      <span className="text-white">{name}</span>
      <span className="text-gold text-xs tabular-nums">{level}%</span>
    </div>
    <div className="h-1.5 bg-line overflow-hidden" role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={name}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full bg-gold"
      />
    </div>
  </div>
);

export default SkillBar;