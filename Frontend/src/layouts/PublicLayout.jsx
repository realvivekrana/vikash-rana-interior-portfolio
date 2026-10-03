import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen bg-ink">
    <Outlet />
  </div>
);

export default PublicLayout;