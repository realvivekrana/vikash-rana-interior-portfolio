import { Link } from 'react-router-dom';
import {
  FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaPinterestP,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaDownload, FaArrowUp,
} from 'react-icons/fa';
import { useSite } from '../../context/SiteContext';
import useFetch from '../../hooks/useFetch';
import { fileUrl } from '../../utils/format';

const socials = [
  ['instagram', FaInstagram],
  ['facebook', FaFacebookF],
  ['linkedin', FaLinkedinIn],
  ['youtube', FaYoutube],
  ['pinterest', FaPinterestP],
];

const quickLinks = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/services', 'Services'],
  ['/skills', 'Skills'],
  ['/resume', 'Resume'],
  ['/pdfs', 'PDFs'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const headingClass = 'text-gold text-xs uppercase tracking-[0.3em] mb-4 sm:mb-5';

const Footer = () => {
  const { settings: s } = useSite();
  const { data: resume } = useFetch('/documents/resume');
  const wa = s?.whatsapp?.replace(/\D/g, '');
  const siteName = s?.siteName || 'Vikash Rana Interiors';
  const hasSocial = socials.some(([key]) => s?.socialLinks?.[key]);

  return (
    <>
      <footer className="bg-surface border-t border-line mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-10 sm:pt-14 pb-8 sm:pb-12 grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-12 lg:gap-x-10">
          {/* Brand: mobile par poori width */}
          <div className="col-span-2 lg:col-span-5">
            <h3 className="font-serif text-2xl text-white mb-3 break-words">{siteName}</h3>
            <div className="w-10 h-px bg-gold mb-4" />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
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

            {hasSocial && (
              <div className="flex flex-wrap gap-3 mt-6">
                {socials.map(([key, Icon]) =>
                  s?.socialLinks?.[key] ? (
                    <a
                      key={key}
                      href={s.socialLinks[key]}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={key}
                      className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold transition-colors"
                    >
                      <Icon />
                    </a>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Quick links: mobile par 2-column list se kam scroll */}
          <nav className="col-span-1 lg:col-span-3" aria-label="Footer">
            <h4 className={headingClass}>Quick Links</h4>
            <ul className="text-sm text-neutral-400">
              {quickLinks.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-gold transition-colors flex items-center min-h-10">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-1 lg:col-span-4 min-w-0">
            <h4 className={headingClass}>Contact</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              {s?.phone && (
                <li className="flex gap-3 min-w-0">
                  <FaPhoneAlt className="text-gold mt-1 shrink-0" />
                  <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} className="hover:text-gold break-words min-w-0">{s.phone}</a>
                </li>
              )}
              {s?.email && (
                <li className="flex gap-3 min-w-0">
                  <FaEnvelope className="text-gold mt-1 shrink-0" />
                  <a href={`mailto:${s.email}`} className="hover:text-gold break-all min-w-0">{s.email}</a>
                </li>
              )}
              {s?.address && (
                <li className="flex gap-3 min-w-0">
                  <FaMapMarkerAlt className="text-gold mt-1 shrink-0" />
                  <span className="break-words min-w-0">{s.address}</span>
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
        </div>

        {/* Bottom bar: neeche floating WhatsApp/Admin buttons ke liye extra jagah (mobile) */}
        <div className="border-t border-line px-5 pt-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-5 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-600 text-center">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          <span className="hidden sm:inline text-neutral-800">|</span>
          <Link to="/admin" className="hover:text-gold transition-colors inline-flex items-center min-h-11">Admin Login</Link>
          <span className="hidden sm:inline text-neutral-800">|</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-gold transition-colors inline-flex items-center gap-2 min-h-11"
          >
            <FaArrowUp /> Back to top
          </button>
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