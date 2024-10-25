import React from 'react';
import Table from '../Table/Table';
import './MainDash.css';
import Ports from '../../pages/Ports';

 
const MainDash = () => {
  return (
    <div className="MainDash">
      <h1>Ports Dashboard</h1>
      <Table />
    </div>
  );
};

export default MainDash;
