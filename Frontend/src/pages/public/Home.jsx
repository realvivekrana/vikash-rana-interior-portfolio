import Seo from '../../components/common/Seo';
import Hero from '../../components/home/Hero';
import FeaturedProjects from '../../components/home/FeaturedProjects';
import AboutPreview from '../../components/home/AboutPreview';
import ServicesSection from '../../components/home/ServicesSection';
import SkillsSection from '../../components/home/SkillsSection';
import Testimonials from '../../components/home/Testimonials';

const Home = () => (
  <>
    <Seo />
    <Hero />
    <FeaturedProjects />
    <AboutPreview />
    <ServicesSection />
    <SkillsSection />
    <Testimonials />
  </>
);

export default Home;