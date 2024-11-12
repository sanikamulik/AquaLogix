import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [isCustomerSignedUp, setIsCustomerSignedUp] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Simulating the customer sign-up process
  const handleSignUpAsCustomer = () => {
    setIsCustomerSignedUp(true); // When the customer signs up, this flag will be true
  };

  

  return (
    <>
      <Navbar onSignUpAsCustomer={handleSignUpAsCustomer} />
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <img
          src="/homebg.png"
          alt=""
          className="object-cover w-full h-full opacity-90"
        />

        {/* Subtle Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))",
          }}
        ></div>

        {/* Text Over the Image */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ marginBottom: "16rem" }}
        >
          <div className="text-center">
            <h1 className="text-cyan-700 text-3xl font-bold mb-2">EXPLORE</h1>
            <p className="text-neutral-700 font-bold text-6xl">AquaLogix</p>
          </div>

          {/* Conditionally render the "TransportMyGoodies" button based on customer sign-up */}
          {isCustomerSignedUp && (
            <>
              <button
                onClick={handleOpenForm}
                className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-md"
              >
                TransportMyGoodies
              </button>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
