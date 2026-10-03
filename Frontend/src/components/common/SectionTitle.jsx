const SectionTitle = ({ eyebrow, title, subtitle, center = true }) => (
  <div className={`mb-12 md:mb-16 ${center ? 'text-center' : ''}`}>
    {eyebrow && <p className="text-gold tracking-[0.35em] text-xs uppercase mb-3">{eyebrow}</p>}
    <h2 className="font-serif text-3xl md:text-5xl text-white">{title}</h2>
    <div className={`w-14 h-px bg-gold mt-5 ${center ? 'mx-auto' : ''}`} />
    {subtitle && (
      <p className={`text-neutral-400 mt-5 max-w-2xl ${center ? 'mx-auto' : ''}`}>{subtitle}</p>
    )}
  </div>
);

export default SectionTitle;