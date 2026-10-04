import { Link } from 'react-router-dom';
import {
  FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaPinterestP,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaDownload, FaArrowUp, FaArrowRight,
} from 'react-icons/fa';
import { useSite } from '../../context/SiteContext';
import useFetch from '../../hooks/useFetch';
import { fileUrl } from '../../utils/format';

const socials = [
  ['instagram', FaInstagram, 'Instagram'],
  ['facebook', FaFacebookF, 'Facebook'],
  ['linkedin', FaLinkedinIn, 'LinkedIn'],
  ['youtube', FaYoutube, 'YouTube'],
  ['pinterest', FaPinterestP, 'Pinterest'],
];

const quickLinks = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/gallery', 'Gallery'],
  ['/ai-tools', 'AI Tools'],
  ['/services', 'Services'],
  ['/skills', 'Skills'],
  ['/resume', 'Resume'],
  ['/pdfs', 'PDFs'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const headingClass = 'text-gold text-xs uppercase tracking-[0.3em] mb-5 lg:mb-6';
const linkClass = 'hover:text-gold transition-colors';

const Footer = () => {
  const { settings: s } = useSite();
  const { data: resume } = useFetch('/documents/resume');
  const wa = s?.whatsapp?.replace(/\D/g, '');
  const siteName = s?.siteName || 'Vikash Rana Interiors';
  const activeSocials = socials.filter(([key]) => s?.socialLinks?.[key]);
  const hasContact = s?.phone || s?.email || s?.address || s?.workingHours;

  return (
    <>
      <footer className="bg-surface border-t border-line mt-16 md:mt-24">
        {/* Call-to-action strip */}
        <div className="border-b border-line bg-ink/60">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 sm:py-10 lg:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-center md:text-left">
            <div className="min-w-0">
              <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">Have a space in mind?</p>
              <p className="text-neutral-400 text-sm lg:text-base mt-2 lg:mt-3">Tell us about it and get a free consultation.</p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-3 min-h-12 px-8 bg-gold hover:bg-gold-light text-black text-xs uppercase tracking-[0.25em] transition-colors"
            >
              Get in touch <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Main columns: 1 col (mobile) -> 2 col (tablet) -> 12-col grid (desktop) */}
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 sm:py-12 lg:py-16 grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-x-16 xl:gap-x-24">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <h3 className="font-serif text-2xl text-white break-words">{siteName}</h3>
            <div className="w-10 h-px bg-gold my-4" />
            <p className="text-neutral-400 text-sm lg:text-[15px] leading-relaxed max-w-md">
              {s?.tagline || 'Crafting timeless interiors that reflect your personality and elevate everyday living.'}
            </p>

            {resume && (
              <a
                href={fileUrl(resume._id, 'download')}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-6 border border-gold text-gold hover:bg-gold hover:text-black text-xs uppercase tracking-[0.2em] transition-colors"
              >
                <FaDownload /> Download Resume
              </a>
            )}

            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {activeSocials.map(([key, Icon, label]) => (
                  <a
                    key={key}
                    href={s.socialLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links: 2 columns on mobile/tablet, single list on desktop */}
          <nav className="min-w-0" aria-label="Footer">
            <h4 className={headingClass}>Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-6 lg:gap-x-10 lg:grid-flow-col lg:grid-rows-5 text-sm text-neutral-400">
              {quickLinks.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className={`${linkClass} flex items-center min-h-11 lg:min-h-10`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          {hasContact && (
            <div className="min-w-0">
              <h4 className={headingClass}>Contact</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                {s?.phone && (
                  <li className="flex gap-3 min-w-0">
                    <FaPhoneAlt className="text-gold mt-1 shrink-0" />
                    <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className={`${linkClass} break-words min-w-0`}>
                      {s.phone}
                    </a>
                  </li>
                )}
                {wa && (
                  <li className="flex gap-3 min-w-0">
                    <FaWhatsapp className="text-gold mt-1 shrink-0" />
                    <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className={`${linkClass} min-w-0`}>
                      Chat on WhatsApp
                    </a>
                  </li>
                )}
                {s?.email && (
                  <li className="flex gap-3 min-w-0">
                    <FaEnvelope className="text-gold mt-1 shrink-0" />
                    <a href={`mailto:${s.email}`} className={`${linkClass} break-all min-w-0`}>
                      {s.email}
                    </a>
                  </li>
                )}
                {s?.address && (
                  <li className="flex gap-3 min-w-0">
                    <FaMapMarkerAlt className="text-gold mt-1 shrink-0" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${linkClass} break-words whitespace-pre-line min-w-0`}
                    >
                      {s.address}
                    </a>
                  </li>
                )}
                {s?.workingHours && (
                  <li className="flex gap-3 min-w-0">
                    <FaClock className="text-gold mt-1 shrink-0" />
                    <span className="whitespace-pre-line break-words min-w-0">{s.workingHours}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar. Mobile par neeche floating WhatsApp/Admin buttons ke liye extra jagah */}
        <div className="border-t border-line">
          <div
            className={`max-w-7xl mx-auto px-5 md:px-8 pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-x-6 gap-y-1 text-xs text-neutral-500 text-center ${
              wa ? 'md:pr-24' : ''
            }`}
          >
            <div className="flex flex-col items-center md:items-start gap-1">
              <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
              <span className="text-[11px] text-neutral-600">
                Designed &amp; developed by{' '}
                <a
                  href="https://my-portfolio-mern-mauve.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-gold underline underline-offset-2 decoration-neutral-700 hover:decoration-gold transition-colors"
                >
                  Vivek Rana
                </a>
              </span>
            </div>
            <div className="flex items-center justify-center gap-x-6">
              <Link to="/admin" className={`${linkClass} inline-flex items-center min-h-11`}>
                Admin Login
              </Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`${linkClass} inline-flex items-center gap-2 min-h-11`}
              >
                <FaArrowUp /> Back to top
              </button>
            </div>
          </div>
        </div>
      </footer>

      {wa && (
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:right-5 sm:bottom-5 z-40 h-14 w-14 flex items-center justify-center rounded-full bg-[#25D366] text-white text-2xl shadow-lg hover:scale-110 transition-transform"
        >
          <FaWhatsapp />
        </a>
      )}
    </>
  );
};

export default Footer;