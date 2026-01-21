import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const AdminRoute: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    // Check if user is authenticated and has admin role
    console.log('AdminRoute Check:', { isAuthenticated, user, role: user?.role });

    if (!isAuthenticated || !user) {
        console.warn('AdminRoute: Not authenticated or no user');
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        console.warn('AdminRoute: Role mismatch', { expected: 'admin', actual: user.role });
        // If authenticated but not admin, redirect to user dashboard
        return <Navigate to="/dashboard" replace />;
    }

    console.log('AdminRoute: Access granted');
    return <Outlet />;
};
