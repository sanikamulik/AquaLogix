import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'; // Import axios for HTTP requests
import './Table.css';

// Styling for the status cell
const makeStyle = (status) => {
  if (status === 'Approved') {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
      width : '90%',
    };
  } else if (status === 'Pending') {
    return {
      background: '#ffadad8f',
      color: 'red',
      width : '90%',
    };
  } else if (status === 'Delivered') {
    return {
      background: '#59bfff',
      color: 'blue',
    };
  } else {
    return {
      background: '#f0f0f0',
      color: 'black',
    };
  }
};

export default function BasicTable() {
  const [shippingRequests, setShippingRequests] = useState([]);

  useEffect(() => {
    // Fetch shipping requests from the backend
    const fetchShippingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/shipping-requests');
        setShippingRequests(response.data);
      } catch (error) {
        console.error('Error fetching shipping requests:', error);
      }
    };

    fetchShippingRequests();
  }, []);

  return (
    <div className="Table">
      <h3 className='font-semibold text-black mt-2'>Shippings</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: '0px 13px 20px 0px #80808029' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell> {/* New Order ID Column */}
              <TableCell>Source</TableCell>
              <TableCell align="left">Destination</TableCell>
              <TableCell align="left">Goods Type</TableCell>
              <TableCell align="left">Weight (kg)</TableCell>
              <TableCell align="left">Status</TableCell> {/* New Status Column */}
              <TableCell align="left">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingRequests.map((request, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{request.orderId}</TableCell> {/* Display Order ID */}
                <TableCell>{request.source}</TableCell>
                <TableCell align="left">{request.destination}</TableCell>
                <TableCell align="left">{request.goodsType}</TableCell>
                <TableCell align="left">{request.weight}</TableCell>
                <TableCell align="left" style={makeStyle(request.status)}>{request.status}</TableCell> {/* Render Status */}
                <TableCell align="left">{new Date(request.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
