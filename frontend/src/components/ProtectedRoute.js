import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Periksa apakah token ada
  const token = localStorage.getItem("token");

  // Jika token tidak ada, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika token ada, izinkan akses ke elemen yang dilindungi
  return element;
};

export default ProtectedRoute;
