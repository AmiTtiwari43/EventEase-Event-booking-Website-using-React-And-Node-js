import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 