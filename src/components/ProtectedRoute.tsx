import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not have permission, redirect to home or another page
    return <Navigate to="/" />;
  }

  return children; // User is allowed, render the children
};

export default ProtectedRoute; 