import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEV_BYPASS_ROUTES = ['/ninos', '/admin/ninos'];

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isDev = import.meta.env.DEV;
  const isKidsOrAdminNinos = DEV_BYPASS_ROUTES.includes(location.pathname) || location.pathname.startsWith('/ninos/');
  const skipAuth = isDev && isKidsOrAdminNinos;

  if (loading && !skipAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <img src="/logo.png" alt="Selah Vida" className="mb-4" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
          <p className="text-dark-blue/60">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!skipAuth && !user) return <Navigate to="/login" replace />;

  return children;
}
