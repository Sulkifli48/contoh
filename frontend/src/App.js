import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DashAdmin from './pages/admin/dashboard/DashAdmin';
import AddAdmin from './pages/admin/addAdmin/AddAdmin';
import Dosen from './pages/admin/dosen/Dosen';
import Matakuliah from './pages/admin/matakuliah/Matakuliah';
import Ruangan from './pages/admin/ruangan/Ruangan';
import Jadwal from './pages/admin/jadwal/Jadwal';
import Kelas from './pages/admin/kelas/Kelas';
import Login from './pages/login/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Impor ProtectedRoute

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute element={<DashAdmin />} />} />
        <Route path="/admin/add-admin" element={<ProtectedRoute element={<AddAdmin />} />} />
        <Route path="/admin/dosen" element={<ProtectedRoute element={<Dosen />} />} />
        <Route path="/admin/matakuliah" element={<ProtectedRoute element={<Matakuliah />} />} />
        <Route path="/admin/kelas" element={<ProtectedRoute element={<Kelas />} />} />
        <Route path="/admin/ruangan" element={<ProtectedRoute element={<Ruangan />} />} />
        <Route path="/admin/jadwal" element={<ProtectedRoute element={<Jadwal />} />} />
      </Routes>
    </Router>
  );
};

export default App;
