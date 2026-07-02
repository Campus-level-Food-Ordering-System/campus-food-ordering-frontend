import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading_screen">Loading...</div>; // You can replace this with a better loading spinner component
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they try to access an unauthorized route
        if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'VENDOR') return <Navigate to="/vendor-dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
