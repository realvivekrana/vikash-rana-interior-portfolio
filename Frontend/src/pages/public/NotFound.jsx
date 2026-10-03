import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';

const NotFound = () => (
  <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
    <Seo title="Page not found" />
    <p className="font-serif text-7xl sm:text-8xl text-gold">404</p>
    <h1 className="font-serif text-2xl sm:text-3xl text-white mt-4">This page could not be found</h1>
    <p className="text-neutral-400 mt-3 max-w-md">
      The page you are looking for may have moved or no longer exists.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto">
      <Link
        to="/"
        className="bg-gold hover:bg-gold-light text-black px-9 min-h-11 inline-flex items-center justify-center text-xs uppercase tracking-[0.25em] transition-colors"
      >
        Back to Home
      </Link>
      <Link
        to="/projects"
        className="border border-gold text-gold hover:bg-gold hover:text-black px-9 min-h-11 inline-flex items-center justify-center text-xs uppercase tracking-[0.25em] transition-colors"
      >
        View Projects
      </Link>
    </div>
  </section>
);

export default NotFound;