import React from 'react';
// Apne custom hook ka path check karein
import { useAuth } from '../../context/Context.jsx'; // SAHI
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../common/Loader.jsx'; // Loader import karein

const ProtectedRoute = () => {
  // Yahan 'useAuth' hook use karein (jo Context se link hai)
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Agar auth state check ho rahi hai, tou loader dikhayein
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    ); 
  }

  // Agar login hai tou page dikhao, warna login pe bhej do
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;