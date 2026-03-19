// components/auth/PartnerRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const PartnerRoute: React.FC = () => {
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

    if (user.role !== 'partner' && user.role !== 'admin' && user.role !== 'super_admin') {
        switch (user.role) {
            case 'affiliate':
                return <Navigate to="/affiliate-portal" replace />;
            case 'user':
                return <Navigate to="/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};