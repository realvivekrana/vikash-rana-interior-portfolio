import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Projects from '../pages/public/Projects';
import ProjectDetail from '../pages/public/ProjectDetail';
import Services from '../pages/public/Services';
import Contact from '../pages/public/Contact';
import Skills from '../pages/public/Skills';
import Resume from '../pages/public/Resume';
import Pdfs from '../pages/public/Pdfs';
import NotFound from '../pages/public/NotFound';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import ManageProjects from '../pages/admin/ManageProjects';
import ManageServices from '../pages/admin/ManageServices';
import ManageTestimonials from '../pages/admin/ManageTestimonials';
import ManageHero from '../pages/admin/ManageHero';
import ManageAbout from '../pages/admin/ManageAbout';
import Messages from '../pages/admin/Messages';
import Settings from '../pages/admin/Settings';
import ManageSkills from '../pages/admin/ManageSkills';
import ManageDocuments from '../pages/admin/ManageDocuments';
import ActivityMonitor from '../pages/admin/ActivityMonitor';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/pdfs" element={<Pdfs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route path="/admin/login" element={<Login />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="projects" element={<ManageProjects />} />
      <Route path="services" element={<ManageServices />} />
      <Route path="testimonials" element={<ManageTestimonials />} />
      <Route path="hero" element={<ManageHero />} />
      <Route path="about" element={<ManageAbout />} />
      <Route path="messages" element={<Messages />} />
      <Route path="skills" element={<ManageSkills />} />
      <Route path="documents" element={<ManageDocuments />} />
      <Route path="activity" element={<ActivityMonitor />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
);

export default AppRoutes;