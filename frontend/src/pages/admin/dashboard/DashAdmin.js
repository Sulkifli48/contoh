import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";
import { IBook, IClass, ILecturer, IStudy } from '../../../assets/icon/Icon';
import { Link } from 'react-router-dom';

const Card = ({ name, amount, icon, link }) => (
  <Link to={`/admin/${link}`} className="card">
    <img src={icon} alt={`${name} icon`} className='card-icon'/>
    <h3>{name}</h3>
    <p>{amount}</p>
  </Link>
)

const DashAdmin = () => {
  const [matakuliahCount, setMatakuliahCount] = useState(0);
  const [dosenCount, setDosenCount] = useState(0);
  const [ruanganCount, setRuanganCount] = useState(0);
  const [kelasCount, setKelasCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const responses = await Promise.all([
          fetch('http://127.0.0.1:5000/api/listmatakuliah'),
          fetch('http://127.0.0.1:5000/api/listdosen'),
          fetch('http://127.0.0.1:5000/api/listruangan'),
          fetch('http://127.0.0.1:5000/api/listkelas')
        ]);
        
        // Cek setiap respons secara terpisah
        const [matakuliahResponse, dosenResponse, ruanganResponse, kelasResponse] = responses;
        
        if (matakuliahResponse.ok) {
          const matakuliahData = await matakuliahResponse.json();
          setMatakuliahCount(matakuliahData.length);
        }
        
        if (dosenResponse.ok) {
          const dosenData = await dosenResponse.json();
          setDosenCount(dosenData.length);
        }
        
        if (ruanganResponse.ok) {
          const ruanganData = await ruanganResponse.json();
          setRuanganCount(ruanganData.length);
        }
        
        if (kelasResponse.ok) {
          const kelasData = await kelasResponse.json();
          setKelasCount(kelasData.length);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    console.log(fetchCounts)
    fetchCounts();
  }, []);
  
  const cardsData = [
    { name: 'Matakuliah', amount: matakuliahCount, icon: IStudy, link: 'matakuliah' },
    { name: 'Kelas', amount: kelasCount, icon: IBook, link: 'kelas' },
    { name: 'Dosen', amount: dosenCount, icon: ILecturer, link: 'dosen' },
    { name: 'Ruangan', amount: ruanganCount, icon: IClass, link: 'ruangan' },
  ];

  return (
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
};

export default DashAdmin;
