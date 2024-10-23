import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const PortDashboard = () => {
  const [portsData, setPortsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  useEffect(() => {
    // Fetch and parse the CSV file  
    Papa.parse("/MarineTraffic_Ports_Export_2024-10-22.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setPortsData(results.data);
      },
      error: (error) => {
        console.error("Error reading CSV:", error);
      },
    });
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      {/* Background Image */}
      <img
        src="/2nd.jpg"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-90"
      />
      
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 h-full p-4 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-xl font-bold mb-6">Dashboard Menu</h2>
        <ul>
          <li className="py-2 hover:bg-gray-700 rounded"><a href="#overview">Overview</a></li>
          <li className="py-2 hover:bg-gray-700 rounded"><a href="#ports">Ports</a></li>
          <li className="py-2 hover:bg-gray-700 rounded"><a href="#analytics">Analytics</a></li>
          <li className="py-2 hover:bg-gray-700 rounded"><a href="#settings">Settings</a></li>
          <li className="py-2 hover:bg-gray-700 rounded"><a href="#help">Help</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative z-10">
        <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
          <h1 className="text-3xl font-bold">Port Dashboard</h1>
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6">Port Dashboard</h1>
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-md">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Country</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Port</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Unlocode</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Vessels In Port</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Departures (last 24hrs)</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Arrivals (last 24hrs)</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Expected Arrivals</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Local Time</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Related Anchorage</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Area Global</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600 font-medium">Area Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portsData.map((port, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-gray-700">{port.Country}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port.Port}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port.Unlocode}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Vessels In Port']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Departures (last 24hrs)']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Arrivals (last 24hrs)']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Expected Arrivals']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Local Time']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Related Anchorage']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Area Global']}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{port['Area Local']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortDashboard;
