import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";

const Ruangan = () => (
    <div>
      <Sidebar />
      <div className='dashboard'>
        <div className="dashboard-content">
          <h1>List Ruangan</h1>
        </div>
      </div>
    </div>
  );
  
  export default Ruangan;
  