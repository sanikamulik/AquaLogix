import React from 'react';
import './Ticket.css';

const Ticket = ({ senderName, receiverName, shippingDate, estimatedTime, estimatedCost }) => {
  return (
    <div className="ticket">
      <div className="ticket-border">
        <div className="ticket-header">
          <span className="ticket-star">*</span>
          <span className="ticket-star">*</span>
        </div>
        <div className="ticket-info">
          <p><strong>Sender:</strong> {senderName}</p>
          <p><strong>Receiver:</strong> {receiverName}</p>
          <p><strong>Shipping Date:</strong> {new Date(shippingDate).toLocaleDateString()}</p>
          <p><strong>Estimated Time:</strong> {estimatedTime}</p>
          <p><strong>Estimated Cost:</strong> INR {estimatedCost}</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
