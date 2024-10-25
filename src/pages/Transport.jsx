import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShippingRequest = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [goodsType, setGoodsType] = useState('');
  const [weight, setWeight] = useState('');
  const [vessel, setVessel] = useState('');
  const [container, setContainer] = useState('');
  const [company, setCompany] = useState('');
  const [cost, setCost] = useState('');
  const [shippingTime, setShippingTime] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isCustomerSignedUp, setIsCustomerSignedUp] = useState(localStorage.getItem('userRole') === 'customer');

  useEffect(() => {
    setIsCustomerSignedUp(localStorage.getItem('userRole') === 'customer');
  }, []);

  const vesselOptions = ['Vessel A', 'Vessel B', 'Vessel C'];
  const companyOptions = ['Company X', 'Company Y', 'Company Z'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const suggestedContainer = weight > 100 ? '40-ft Container' : '20-ft Container';
    const suggestedVessel = vesselOptions[Math.floor(Math.random() * vesselOptions.length)];
    const suggestedCompany = companyOptions[Math.floor(Math.random() * companyOptions.length)];
    const estimatedCost = (Math.random() * 500).toFixed(2);
    const estimatedTime = `${Math.floor(Math.random() * 10) + 1} days`;
    const trackingNo = `TRK-${Math.floor(Math.random() * 900000 + 100000)}`;

    setVessel(suggestedVessel);
    setContainer(suggestedContainer);
    setCompany(suggestedCompany);
    setCost(estimatedCost);
    setShippingTime(estimatedTime);
    setTrackingNumber(trackingNo);

    // Save the shipping request to the backend
    try {
      const response = await axios.post('http://localhost:5000/shipping-request', {
        source,
        destination,
        goodsType,
        weight,
        shippingDetails: {
          vessel: suggestedVessel,
          container: suggestedContainer,
          shippingCompany: suggestedCompany,
          estimatedCost,
          estimatedTime,
          trackingNumber: trackingNo,
        },
      });
      console.log('Shipping request saved:', response.data);
    } catch (error) {
      console.error('Error saving shipping request:', error);
    }

    // Clear the form fields after submission
    setSource('');
    setDestination('');
    setGoodsType('');
    setWeight('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="/2nd.jpg"
        alt="Background"
        className={`object-cover w-full h-full transition-transform duration-500 ${vessel ? 'scale-105' : ''} opacity-90`}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div
          className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-lg transition-all duration-500 ease-in-out ${vessel ? 'max-h-screen' : 'max-h-[80vh]'} overflow-y-auto`}
          style={{ backdropFilter: 'blur(10px)' }} // Glass effect
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-cyan-700 text-center">Request Your Shipping</h1>

          {isCustomerSignedUp ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black mb-2">Source Address</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="border p-2 w-full bg-white text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-black mb-2">Destination Address</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border p-2 w-full bg-white text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-black mb-2">Type of Goods</label>
                <input
                  type="text"
                  value={goodsType}
                  onChange={(e) => setGoodsType(e.target.value)}
                  className="border p-2 w-full bg-white text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-black mb-2">Weight (in kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="border p-2 w-full bg-white text-black"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white bg-cyan-700 px-4 py-2 rounded hover:bg-cyan-800 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="text-xl text-red-500 mb-4">Please sign up as a customer to request shipping.</h2>
            </div>
          )}

          {/* Display the suggested shipping details after form submission */}
          {vessel && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2 text-white text-center">Shipping Details</h2>
              <p className="text-white"><strong>Vessel:</strong> {vessel}</p>
              <p className="text-white"><strong>Container Type:</strong> {container}</p>
              <p className="text-white"><strong>Shipping Company:</strong> {company}</p>
              <p className="text-white"><strong>Estimated Cost:</strong> ${cost} USD</p>
              <p className="text-white"><strong>Estimated Shipping Time:</strong> {shippingTime} days</p>
              <p className="text-white"><strong>Tracking Number:</strong> {trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingRequest;
