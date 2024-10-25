import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import UploadPhoto from "./UploadPhoto.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "../../App.css";

export default function BasicTable2() {
  const [portsData, setPortsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ports")
      .then((response) => {
        console.log("API Response:", response.data);
        setPortsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching ports data:", error);
      });
  }, []);

  return (
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: "url('2nd.jpg')" }}>
      <Sidebar /> {/* Render the Sidebar component */}
      <div className="flex-grow p-4 bg-white bg-opacity-0 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ports</h3>
        <TableContainer
          component={Paper}
          elevation={3}
          className="w-full max-w-4xl shadow-lg rounded-lg overflow-x-auto overflow-y-auto"
          style={{ maxHeight: "550px" }} // Set your desired fixed height here
        >
          <Table className="min-w-full" aria-label="simple table">
            <TableHead>
              <TableRow className="bg-gray-200 text-gray-700">
                <TableCell className="p-4">Country</TableCell>
                <TableCell align="left" className="p-4">Port</TableCell>
                <TableCell align="left" className="p-4">Unlocode</TableCell>
                <TableCell align="left" className="p-4">Vessels In Port</TableCell>
                <TableCell align="left" className="p-4">Departures (last 24hrs)</TableCell>
                <TableCell align="left" className="p-4">Arrivals (last 24hrs)</TableCell>
                <TableCell align="left" className="p-4">Expected Arrivals</TableCell>
                <TableCell align="left" className="p-4">Local Time</TableCell>
                <TableCell align="left" className="p-4">Related Anchorage</TableCell>
                <TableCell align="left" className="p-4">Area Global</TableCell>
                <TableCell align="left" className="p-4">Area Local</TableCell>
                <TableCell align="left" className="p-4">Upload Photo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portsData.length > 0 ? (
                portsData.map((port) => (
                  <TableRow key={port._id} className="hover:bg-gray-100">
                    <TableCell className="p-4">{port.Country}</TableCell>
                    <TableCell className="p-4">{port.Port}</TableCell>
                    <TableCell className="p-4">{port.Unlocode}</TableCell>
                    <TableCell className="p-4">{port["Vessels In Port"]}</TableCell>
                    <TableCell className="p-4">{port["Departures (last 24hrs)"]}</TableCell>
                    <TableCell className="p-4">{port["Arrivals (last 24hrs)"]}</TableCell>
                    <TableCell className="p-4">{port["Expected Arrivals"]}</TableCell>
                    <TableCell className="p-4">{port["Local Time"]}</TableCell>
                    <TableCell className="p-4">{port["Related Anchorage"]}</TableCell>
                    <TableCell className="p-4">{port["Area Global"]}</TableCell>
                    <TableCell className="p-4">{port["Area Local"]}</TableCell>
                    <TableCell className="p-4">
                      <UploadPhoto portId={port._id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center" className="p-4 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
