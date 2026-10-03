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
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? 'bg-ink/95 backdrop-blur border-b border-line py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          {settings?.logo?.url ? (
            <img src={settings.logo.url} alt={settings.siteName} className="h-9 w-auto" />
          ) : (
            <span className="font-serif text-xl md:text-2xl text-white tracking-wide">
              {settings?.siteName || 'Vikash Rana'}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-9">
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

        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-xl" aria-label="Menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-ink border-t border-line px-5 py-4 flex flex-col">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `py-3 text-sm uppercase tracking-[0.2em] border-b border-line/60 ${
                  isActive ? 'text-gold' : 'text-neutral-300'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;