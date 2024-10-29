import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";

const Kelas = () => (
    <div>
      <Sidebar />
      <div className='dashboard'>
        <div className="dashboard-content">
          <h1>List Kelas</h1>
        </div>
      </div>
    </div>
  );
  
  export default Kelas;
  