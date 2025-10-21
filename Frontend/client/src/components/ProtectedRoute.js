import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// A simple check for authentication. In a real app, you'd use context or a state manager.
const useAuth = () => {
  // This check is now simplified. A more robust check would involve checking a user state.
  const token = localStorage.getItem('isLoggedIn'); // We'll use a simple flag
  return token === 'true';
};

const ProtectedRoute = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;