// src/pages/AdminDashboard.js
import React from 'react';
import Sidebar from '../../components/Sidebar';
import "../css/Admin.css"

const Admin = () => (
    <div >
        <Sidebar />
        <div className="dashboard-content">
            <h1>Admin Dashboard</h1>
            {/* Konten lainnya dapat ditambahkan di sini */}
        </div>
    </div>
);

export default Admin;
