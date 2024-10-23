// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Your existing Home component
import ShippingRequest from './pages/Transport'; // New Page
import PortDashboard from './components/PortDashboard';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shipping-request" element={<ShippingRequest />} />
        <Route path="/company-dashboard" element={<PortDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
