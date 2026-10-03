import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { SiteProvider } from '../context/SiteContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdminBar from '../components/layout/AdminBar';
import useTrackVisit from '../hooks/useTrackVisit';

// Har history entry (location.key) ki scroll position yaad rakhta hai
const positions = new Map();

// Naya page: upar se shuru (turant, smooth animation ke bina).
// Back / forward button: pichhli scroll position wapas (content API se aata hai, isliye thoda wait karte hain).
const ScrollManager = () => {
  const { pathname, key } = useLocation();
  const navType = useNavigationType();
  const lastPath = useRef(null);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const onScroll = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key]);

  useEffect(() => {
    // Same page par state badalna (jaise photo lightbox) scroll nahi chhedta
    if (lastPath.current === pathname) return undefined;
    lastPath.current = pathname;

    const y = navType === 'POP' ? positions.get(key) : 0;
    if (!y) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return undefined;
    }

    let raf;
    const start = performance.now();
    const restore = () => {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
      if (Math.abs(window.scrollY - y) > 2 && performance.now() - start < 2000) {
        raf = requestAnimationFrame(restore);
      }
    };
    restore();
    return () => cancelAnimationFrame(raf);
  }, [pathname, key, navType]);

  return null;
};

const PublicLayout = () => {
  useTrackVisit();

  return (
    <SiteProvider>
      <ScrollManager />
      <div className="min-h-screen bg-ink">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <AdminBar />
      </div>
    </SiteProvider>
  );
};

export default PublicLayout;