import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Pastikan Routes diimpor
import Home from './pages/Home';
import DashAdmin from './pages/admin/dashboard/DashAdmin';
import AddAdmin from './pages/admin/addAdmin/AddAdmin';
import Dosen from './pages/admin/dosen/Dosen';
import Matakuliah from './pages/admin/matakuliah/Matakuliah';
import Ruangan from './pages/admin/ruangan/Ruangan';
import Jadwal from './pages/admin/jadwal/Jadwal';
import Kelas from './pages/admin/kelas/Kelas';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<DashAdmin />} />
            <Route path="/admin/add-admin" element={<AddAdmin />} />

            <Route path="/admin/dosen" element={<Dosen />} />
            <Route path="/admin/matakuliah" element={<Matakuliah />} />
            <Route path="/admin/kelas" element={<Kelas />} />
            <Route path="/admin/ruangan" element={<Ruangan />} />
            <Route path="/admin/jadwal" element={<Jadwal />} />
        </Routes>
    </Router>
);
};

export default App;