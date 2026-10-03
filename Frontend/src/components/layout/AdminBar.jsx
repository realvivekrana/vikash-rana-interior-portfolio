import { Link, useNavigate } from 'react-router-dom';
import { FaThLarge, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminBar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  if (!admin) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-1 bg-surface/95 backdrop-blur border border-gold/50 shadow-lg text-xs">
      <span className="flex items-center gap-2 pl-3 pr-2 py-2 text-gold">
        <FaUserShield />
        <span className="hidden sm:inline uppercase tracking-wider">Admin</span>
      </span>
      <Link
        to="/admin"
        className="flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-gold border-l border-line transition-colors"
      >
        <FaThLarge /> Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-red-400 border-l border-line transition-colors"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default AdminBar;