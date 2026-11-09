import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <p className="empty-state">Verificando sessão…</p>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
