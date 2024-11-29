import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import './Sidebar-category.css';

export default function Sidebar() {
  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();
  const location = useLocation(); // Mengambil path URL saat ini
  const handleLogout = () => {
    setLoggingOut(true);
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_role");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    setTimeout(() => {
      setLoggingOut(false);
      if (!sessionStorage.getItem("user_role")) {
        navigate("/");
        window.location.reload();
      }
      console.log(`Goodbye ${name}`);
    }, 1000);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="logo-details">
        <div className="logo_name">BPKSDMD</div>
        <i className='bx bx-menu' id="btn" onClick={toggleSidebar}></i>
      </div>
      <ul className="nav-list">
        <li className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
          <Link to="/admin/dashboard">
            <i className='bx bx-grid-alt'></i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li className={location.pathname === '/admin/add-admin' ? 'active' : ''}>
          <Link to="/admin/add-admin">
            <i className='bx bx-support'></i>
            <span className="links_name">Admin</span>
          </Link>
          <span className="tooltip">Admin</span>
        </li>
        <li className={location.pathname === '/admin/dosen' ? 'active' : ''}>
          <Link to="/admin/dosen">
            <i className='bx bxs-group'></i>
            <span className="links_name">Dosen</span>
          </Link>
          <span className="tooltip">Dosen</span>
        </li>
        <li className={location.pathname === '/admin/ruangan' ? 'active' : ''}>
          <Link to="/admin/ruangan">
            <i className='bx bxs-home-smile'></i>
            <span className="links_name">Ruangan</span>
          </Link>
          <span className="tooltip">Ruangan</span>
        </li>
        <li className={location.pathname === '/admin/matakuliah' ? 'active' : ''}>
          <Link to="/admin/matakuliah">
            <i className='bx bxs-graduation'></i>
            <span className="links_name">Matakuliah</span>
          </Link>
          <span className="tooltip">Matakuliah</span>
        </li>
        <li className={location.pathname === '/admin/kelas' ? 'active' : ''}>
          <Link to="/admin/kelas">
            <i className='bx bxs-book-open'></i>
            <span className="links_name">Kelas</span>
          </Link>
          <span className="tooltip">Kelas</span>
        </li>
        <li className={location.pathname === '/admin/jadwal' ? 'active' : ''}>
          <Link to="/admin/jadwal">
            <i className='bx bxs-time-five'></i>
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
