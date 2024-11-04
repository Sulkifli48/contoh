// src/pages/AdminDashboard.js
import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { IBook, IClass, ILecturer, IStudy } from '../../../assets/icon/Icon';

import { Link } from 'react-router-dom';

const cardsData = [
  { name: 'Matakuliah', amount: 10, icon: IStudy, link: 'matakuliah' },
  { name: 'Kelas', amount: 30, icon: IBook, link: 'kelas' },
  { name: 'Dosen', amount: 20, icon: ILecturer, link: 'dosen' },
  { name: 'Ruangan', amount: 30, icon: IClass, link: 'ruangan' },
]

const Card = ({ name, amount, icon, link }) => (
  <Link to={`/admin/${link}`} className="card">
    <img src={icon} alt={`${name} icon`} className='card-icon'/>
    <h3>{name}</h3>
    <p>{amount}</p>
  </Link>
)

const DashAdmin = () => (
  <div>
    <Sidebar />
    <div className='dashboard'>
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="cards-container-db">
          {cardsData.map((card, index) => (
            <Card 
              key={index} 
              name={card.name} 
              amount={card.amount} 
              icon={card.icon}
              link={card.link}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashAdmin;
