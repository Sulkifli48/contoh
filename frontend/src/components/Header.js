import React from 'react';

const Header = () => (
    <header className='header'>
        <a className='login' href='/admin/dashboard'>Login</a>
        <div className='head'>
            <h1 className='head-h1'>Departemen Informatika Universitas Hasanuddin</h1>
            <h2 className='head-h2'>Jadwal Perkuliahan Semester Ganjil 2024/2025</h2>
        </div>
    </header>
);

export default Header;