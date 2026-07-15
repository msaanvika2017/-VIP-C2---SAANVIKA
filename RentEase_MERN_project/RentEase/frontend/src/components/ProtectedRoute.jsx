import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-medium animate-pulse">Loading secure session...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, storing original location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Redirect non-admins to the home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
