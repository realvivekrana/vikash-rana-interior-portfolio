import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SiteProvider } from '../context/SiteContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = () => (
  <SiteProvider>
    <ScrollToTop />
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  </SiteProvider>
);

export default PublicLayout;