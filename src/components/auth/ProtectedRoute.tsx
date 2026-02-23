import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Dashboard routing isolation: Bounce non-clients to their correct portal
  if (user.role !== 'user') {
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'partner':
        return <Navigate to="/spaceportal" replace />;
      case 'affiliate':
        return <Navigate to="/affiliate-portal" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
