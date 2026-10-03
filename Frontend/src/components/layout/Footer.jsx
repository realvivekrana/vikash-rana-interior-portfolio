import { Link } from 'react-router-dom';
import {
  FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaPinterestP,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
} from 'react-icons/fa';
import { useSite } from '../../context/SiteContext';

const socials = [
  ['instagram', FaInstagram],
  ['facebook', FaFacebookF],
  ['linkedin', FaLinkedinIn],
  ['youtube', FaYoutube],
  ['pinterest', FaPinterestP],
];

const Footer = () => {
  const { settings: s } = useSite();
  const wa = s?.whatsapp?.replace(/\D/g, '');

  return (
    <>
      <footer className="bg-surface border-t border-line mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl text-white mb-3">{s?.siteName || 'Vikash Rana Interiors'}</h3>
            <div className="w-10 h-px bg-gold mb-4" />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Crafting timeless interiors that reflect your personality and elevate everyday living.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(([key, Icon]) =>
                s?.socialLinks?.[key] ? (
                  <a
                    key={key}
                    href={s.socialLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold transition-colors"
                  >
                    <Icon />
                  </a>
                ) : null
              )}
            </div>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.3em] mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {[['/', 'Home'], ['/projects', 'Projects'], ['/services', 'Services'], ['/about', 'About'], ['/contact', 'Contact']].map(
                ([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-gold transition-colors">{label}</Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.3em] mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              {s?.phone && (
                <li className="flex gap-3"><FaPhoneAlt className="text-gold mt-1 shrink-0" />{s.phone}</li>
              )}
              {s?.email && (
                <li className="flex gap-3"><FaEnvelope className="text-gold mt-1 shrink-0" />{s.email}</li>
              )}
              {s?.address && (
                <li className="flex gap-3"><FaMapMarkerAlt className="text-gold mt-1 shrink-0" />{s.address}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-line py-5 px-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} {s?.siteName || 'Vikash Rana Interiors'}. All rights reserved.</span>
          <span className="hidden sm:inline text-neutral-800">|</span>
          <Link to="/admin" className="hover:text-gold transition-colors">Admin Login</Link>
        </div>
      </footer>

      {wa && (
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-5 right-5 z-40 h-13 w-13 p-3.5 rounded-full bg-[#25D366] text-white text-2xl shadow-lg hover:scale-110 transition-transform"
        >
          <FaWhatsapp />
        </a>
      )}
    </>
  );
};

export default Footer;