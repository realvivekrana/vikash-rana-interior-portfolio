import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSite } from '../../context/SiteContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Page badalne par menu band
  useEffect(() => setOpen(false), [pathname]);

  // Menu khula ho to peeche ka page scroll na ho; Esc se band
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        solid ? 'bg-ink/95 backdrop-blur border-b border-line' : ''
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${
          solid ? 'h-16' : 'h-20'
        }`}
      >
        <Link to="/" className="flex items-center min-h-11" aria-label="Home">
          {settings?.logo?.url ? (
            <img src={settings.logo.url} alt={settings.siteName} className="h-8 md:h-9 w-auto" />
          ) : (
            <span className="font-serif text-lg sm:text-xl md:text-2xl text-white tracking-wide">
              {settings?.siteName || 'Vikash Rana'}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-9" aria-label="Main">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.2em] pb-1 border-b transition-colors ${
                  isActive
                    ? 'text-gold border-gold'
                    : 'text-neutral-300 border-transparent hover:text-gold'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden h-11 w-11 -mr-2 flex items-center justify-center text-white text-xl"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden bg-ink border-t border-line px-5 pb-6 flex flex-col h-[calc(100dvh-4rem)] overflow-y-auto"
          aria-label="Mobile"
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `min-h-14 flex items-center text-base font-serif tracking-wide border-b border-line/60 ${
                  isActive ? 'text-gold' : 'text-neutral-200'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-8 bg-gold text-black min-h-12 flex items-center justify-center text-xs uppercase tracking-[0.25em]"
          >
            Get a Free Consultation
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;