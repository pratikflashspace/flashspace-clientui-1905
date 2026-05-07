import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import {
  getDefaultLoginUrl,
  getLoginRedirectUrl,
  isCheckoutReturnPath,
} from '@/utils/checkoutSession';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    const shouldReturnAfterLogin = isCheckoutReturnPath(redirectTo);
    return (
      <Navigate
        to={
          shouldReturnAfterLogin
            ? getLoginRedirectUrl(redirectTo)
            : getDefaultLoginUrl()
        }
        state={shouldReturnAfterLogin ? { redirectTo } : undefined}
        replace
      />
    );
  }

  return <Outlet />;
};
