import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const AffiliateRoute: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check for affiliate role
    if (user.role !== 'affiliate') {
        // Redirect unauthorized users to their appropriate dashboard or home
        switch (user.role) {
            case 'super_admin':
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'partner':
                return <Navigate to="/spaceportal" replace />;
            case 'user':
                return <Navigate to="/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};
