import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // FAIL-SAFE CHECK: Grants access if role matches OR if email matches your account as a backup
  const isAuthorized = user && (
    user.role === 'superAdmin' || 
    user.role === 'admin' || 
    user.email === 'rajesh36@gmail.com'
  );
  
  if (!isAuthorized) {
    console.warn("🛡️ AdminRoute: Unauthorized access attempt deflected.", user);
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }
  
  return children;
};

export default AdminRoute;