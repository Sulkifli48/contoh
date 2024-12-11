import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Ambil status login dari sessionStorage atau state global
  const isLoggedIn = !!sessionStorage.getItem("user_id");

  if (!isLoggedIn) {
    // Jika pengguna tidak login, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
