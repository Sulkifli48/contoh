// src/pages/AdminDashboard.js
import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

import "../css/Admin.css";
import IconStudy from '../../assets/img/study.png';
import IconLecturer from '../../assets/img/lecturer.png';
import IconBook from '../../assets/img/book.png';
import IconClassroom from '../../assets/img/classroom.png';

const cardsData = [
  { name: 'Matakuliah', amount: 10, icon: IconStudy },
  { name: 'Kelas', amount: 30, icon: IconBook },
  { name: 'Dosen', amount: 20, icon: IconLecturer },
  { name: 'Ruangan', amount: 30, icon: IconClassroom },
];

const Card = ({ name, amount, icon }) => (
  <div className="card">
    <img src={icon} alt={`${name} icon`} className='card-icon'/>
    <h3>{name}</h3>
    <p>{amount}</p>
  </div>
);

const Admin = () => (
  <div>
    <Sidebar />
    <div className='dashboard'>
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="cards-container-db">
          {cardsData.map((card, index) => (
            <Card key={index} name={card.name} amount={card.amount} icon={card.icon}/>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Admin;
