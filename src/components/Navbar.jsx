import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState(""); // New state for registration number
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  useEffect(() => {
    console.log("User role has been updated:", userRole);
  }, [userRole]);

  const validRegistrationNumbers = ["REG123", "REG456", "REG789"]; // Predefined valid registration numbers

  const handleRoleSelect = (selectedRole) => {
    console.log("Selected role:", selectedRole);
    setRole(selectedRole);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate registration number for companies
    if (role === "company" && !validRegistrationNumbers.includes(registrationNumber)) {
      alert("Invalid registration number. Please enter a valid number.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
        role,
        registrationNumber: role === "company" ? registrationNumber : undefined, // Include only if company
      });

      alert(response.data.message);
      setUserRole(response.data.role);
      localStorage.setItem("userRole", response.data.role);
      setShowForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error registering user");
    }

    console.log(role);
  };

  const handleLogout = () => {
    setUserRole(""); // Clear user role from state
    localStorage.removeItem("userRole"); // Remove from localStorage
    navigate("/"); // Navigate to home or login page
  };

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-10 backdrop-blur-md bg-opacity-40 text-black text-base">
      <div className="text-2xl">
        <span className="text-blue-900 font-semibold">Aqua</span>
        <span className=" text-emerald-600 font-semibold">Logix</span>
      </div>

      <div className="flex space-x-8 mt-1">
        {!userRole && (
          <>
            <button className="font-bold">Home</button>
            <button>Services</button>
            <button>About Us</button>
          </>
        )}
        {userRole === "customer" && (
          <>
            <button onClick={() => navigate("/shipping-request")}>
              TransportMyGoodies
            </button>
            {/* <button>Track</button> */}
          </>
        )}

        {userRole === "company" && (
          <>
            <button onClick={() => navigate("/company-dashboard")}>
              Dashboard
            </button>
            {/* <button>Route Optimization</button>
            <button>Logistics Manager</button> */}
          </>
        )}

        {userRole ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => setShowForm(!showForm)}>Sign Up</button>
        )}
      </div>

      {/* Signup form */}
      {showForm && (
        <div className="fixed inset-0 top-20 left-10 bg-gray-900 bg-opacity-50">
          <div className="bg-white max-w-md w-full mx-auto rounded-lg shadow-lg p-6 transition-transform transform scale-100">
            <h2 className="text-xl mb-4 text-center font-semibold">Sign Up</h2>

            {!role && (
              <div>
                <button
                  className="mr-4 text-blue-500 font-medium border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                  onClick={() => handleRoleSelect("customer")}
                >
                  Sign up as Customer
                </button>
                <button
                  className="mr-4 text-blue-500 font-medium border border-blue-500 rounded-md px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                  onClick={() => handleRoleSelect("company")}
                >
                  Sign up as Company
                </button>
              </div>
            )}

            {role && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full bg-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full bg-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full bg-white"
                    required
                  />
                </div>

                {role === "company" && ( // Add input for registration number if the user is signing up as a company
                  <div className="mb-4">
                    <label className="block">Registration Number</label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="border p-2 w-full bg-white"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-cyan-700 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
