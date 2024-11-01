import { useState } from 'react';
import './Sidebar.css';
import './Sidebar-category.css';
import { Link, useNavigate } from 'react-router-dom';

// import IconCS from '../../assets/img/support.png';

export default function Sidebar() {
  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Menampilkan loading
    setLoggingOut(true);

    // Hapus informasi autentikasi dari sesi pengguna
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_role");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");

    setTimeout(() => {
      // Sembunyikan loading
      setLoggingOut(false);

      // Redirect ke halaman login
      if (!sessionStorage.getItem("user_role")) {
        navigate("/");
        window.location.reload();
      }

      console.log(`Good bye ${name}`);
    }, 1000);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-details">
        <div className="logo_name">BPKSDMD</div>
        <i className='bx bx-menu' id="btn" onClick={toggleSidebar}></i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/admin/dashboard">
            <i className='bx bx-grid-alt'></i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/admin/add-admin">
            <i class='bx bx-support'></i>
            <span className="links_name">Admin</span>
          </Link>
          <span className="tooltip">Admin</span>
        </li>
        <li>
          <Link to="/admin/dosen">
            <i class='bx bxs-group'></i>
            <span className="links_name">Dosen</span>
          </Link>
          <span className="tooltip">Dosen</span>
        </li>
        <li>
          <Link to="/admin/ruangan">
            <i class='bx bxs-home-smile'></i>
            <span className="links_name">Ruangan</span>
          </Link>
          <span className="tooltip">Ruangan</span>
        </li>
        <li>
          <Link to="/admin/matakuliah">
            <i class='bx bxs-graduation'></i>
            <span className="links_name">Matakuliah</span>
          </Link>
          <span className="tooltip">Matakuliah</span>
        </li>
        <li>
          <Link to="/admin/kelas">
          <i class='bx bxs-book-open'/>
            <span className="links_name">Kelas</span>
          </Link>
          <span className="tooltip">Kelas</span>
        </li>
        <li>
          <Link to="/admin/jadwal">
            <i class='bx bxs-time-five' ></i>
            <span className="links_name">Jadwal</span>
          </Link>
          <span className="tooltip">Jadwal</span>
        </li>

        <li className="profile">
          <div className="profile-details">
            <div className="name_job">
              <div className="name">{name}</div>
              <div className="job">{email}</div>
            </div>
          </div>
          {loggingOut ? (
            <div>Loading...</div>
          ) : (
            <i className='bx bx-log-out' id="log_out" onClick={handleLogout}></i>
          )}
        </li>
      </ul>
    </div>
  );
}
