import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaThLarge, FaImages, FaConciergeBell, FaQuoteLeft, FaImage,
  FaUser, FaEnvelope, FaCog, FaSignOutAlt, FaBars, FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FaThLarge, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FaImages },
  { to: '/admin/services', label: 'Services', icon: FaConciergeBell },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FaQuoteLeft },
  { to: '/admin/hero', label: 'Hero Section', icon: FaImage },
  { to: '/admin/about', label: 'About', icon: FaUser },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
  { to: '/admin/settings', label: 'Settings', icon: FaCog },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-surface border-b border-line">
        <span className="font-serif text-gold text-lg">Admin Panel</span>
        <button onClick={() => setOpen(!open)} className="text-white text-xl">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 lg:top-0 bottom-0 left-0 z-40 w-64 bg-surface border-r border-line flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="hidden lg:block px-6 py-8 border-b border-line">
          <h1 className="font-serif text-2xl text-white">Vikash Rana</h1>
          <p className="text-gold text-[10px] tracking-[0.3em] uppercase mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2 ${
                  isActive
                    ? 'border-gold text-gold bg-gold/5'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="text-base" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-line">
          <p className="text-xs text-neutral-500 truncate mb-3 px-2">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-line text-neutral-300 hover:border-gold hover:text-gold transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="lg:ml-64 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;