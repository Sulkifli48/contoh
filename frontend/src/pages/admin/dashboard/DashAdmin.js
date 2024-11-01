// src/pages/AdminDashboard.js
import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { IBook, IClass, ILecturer, IStudy } from '../../../assets/icon/Icon';

const cardsData = [
  { name: 'Matakuliah', amount: 10, icon: IStudy },
  { name: 'Kelas', amount: 30, icon: IBook },
  { name: 'Dosen', amount: 20, icon: ILecturer },
  { name: 'Ruangan', amount: 30, icon: IClass },
]

const Card = ({ name, amount, icon }) => (
  <div className="card">
    
    <img src={icon} alt={`${name} icon`} className='card-icon'/>
    <h3>{name}</h3>
    <p>{amount}</p>
  </div>
)

const DashAdmin = () => (
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

export default DashAdmin;
