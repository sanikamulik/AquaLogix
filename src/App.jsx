// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Your existing Home component
import ShippingRequest from './pages/Transport'; // New Page
import PortDashboard from './components/PortDashboard';
import BasicTable2 from './components/Table/Table2';

// import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';

const iconUrl = "/Anchr_pictogram_red.png";


const customIcon = new Icon({
  iconUrl: iconUrl, // Directly use the imported icon URL
  iconSize: [38, 38], // size of the icon
});


// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(70, 70, true),
  });
};

// markers data
const markers = [
  { geocode: [18.54, 72.49], popUp: "MUMBAI ANCH" },
  { geocode: [18.9601, 72.8502], popUp: "MUMBAI PORT" },
  { geocode: [9.9546, 76.2678], popUp: "COCHIN ANCH" },
  { geocode: [17.6856, 83.216], popUp: "VISAKHAPATNAM PORT" },
  { geocode: [16.9399, 82.2492], popUp: "KAKINDA PORT" },
  { geocode: [22.0446, 88.089], popUp: "HALDIA PORT" },
  { geocode: [12.85, 74.8354], popUp: "MANGALORE PORT" },
  { geocode: [11.6234, 92.7265], popUp: "PORT BLAIR" },
  { geocode: [22.5461, 88.3149], popUp: "KOLKATA PORT" },
];

// Map component
function MapComponent() {
  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={6} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}


function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shipping-request" element={<ShippingRequest />} />
        <Route path="/company-dashboard" element={<PortDashboard />} />
        <Route path="/ports" element={<BasicTable2 />} />
        <Route path="/map" element={<MapComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
