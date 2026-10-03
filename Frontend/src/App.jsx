import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#141414', color: '#e5e5e5', border: '1px solid #262626' },
          success: { iconTheme: { primary: '#c9a24b', secondary: '#000' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;