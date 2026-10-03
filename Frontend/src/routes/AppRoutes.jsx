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
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
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
    </Route>
  </Routes>
);

export default AppRoutes;