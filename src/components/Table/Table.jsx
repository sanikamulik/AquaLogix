import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import './Table.css';

const makeStyle = (status) => {
  switch (status) {
    case 'Approved':
      return { background: 'rgb(145 254 159 / 47%)', color: 'green' };
    case 'Pending':
      return { background: '#ffadad8f', color: 'red' };
    case 'Delivered':
      return { background: '#59bfff', color: 'blue' };
    default:
      return { background: '#f0f0f0', color: 'black' };
  }
};

export default function ShippingRequestTable() {
  const [shippingRequests, setShippingRequests] = useState([]);

  useEffect(() => {
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
      <h3 className="font-semibold text-black mt-2">Shippings</h3>
      <TableContainer
        component={Paper}
        style={{
          boxShadow: '0px 13px 20px 0px #80808029',
          maxHeight: '350px', // Set fixed height for vertical scroll
          maxWidth: '1000px', // Set fixed width for horizontal scroll
          overflow: 'auto', // Enable both X and Y scrolling
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead  >
            <TableRow >
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Sender Name</TableCell>
              <TableCell  style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Receiver Name</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Item</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Category</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Approx. Weight (kg)</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Source</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Destination</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Shipping Date</TableCell>
              <TableCell style={{backgroundColor: '#dcfce7', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingRequests.map((request, index) => (
              <TableRow key={index}>
                <TableCell>{request.orderId}</TableCell>
                <TableCell>{request.senderName}</TableCell>
                <TableCell>{request.receiverName}</TableCell>
                <TableCell>{request.item}</TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{request.approxWeight}</TableCell>
                <TableCell>{request.source}</TableCell>
                <TableCell>{request.destination}</TableCell>
                <TableCell>{new Date(request.shippingDate).toLocaleDateString()}</TableCell>
                {/* <TableCell>{request.estimatedCost ? `$${request.estimatedCost.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell>{request.estimatedTime}</TableCell> */}
                <TableCell style={makeStyle(request.status)}>{request.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
