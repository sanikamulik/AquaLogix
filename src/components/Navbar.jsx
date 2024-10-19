import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Navbar() {
  const [showForm, setShowForm] = useState(false); // Control modal visibility
  const [role, setRole] = useState(""); // Track whether signing up as customer or company
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState(""); // For company signup
  const [userRole, setUserRole] = useState(""); // Store role after signup to change navbar

  // This will trigger whenever the userRole state changes (debugging purpose)
  useEffect(() => {
    console.log('User role has been updated:', userRole);
  }, [userRole]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setShowForm(true); // Show the form after selecting role
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        name,
        email,
        password,
        role,
        securityKey: role === 'company' ? securityKey : undefined,  // Only send securityKey if signing up as company
      });

      alert(response.data.message);  // Show success message or error message

      // Update the userRole state, and close the modal
      setUserRole(response.data.role);  // Set the user role from the response
      setShowForm(false);  // Close the modal after successful submission

    } catch (error) {
      alert(error.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-10 backdrop-blur-md bg-opacity-40 text-black text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="text-2xl">
        <span className="text-emerald-600">Aqua</span>
        <span className="text-blue-900">Logix</span>
      </div>
      <div className="flex space-x-8 mt-1">
        <div className="font-bold">Home</div>

        {/* Conditional rendering of buttons based on the user role */}
        {userRole === 'customer' && (
          <>
            <div>Customer Dashboard</div>
            <div>Customer Services</div>
          </>
        )}

        {userRole === 'company' && (
          <>
            <div>Company Dashboard</div>
            <div>Manage Shipments</div>
          </>
        )}

        {!userRole && (
          <button onClick={() => setShowForm(!showForm)}>Sign Up</button>
        )}
      </div>

      {/* Signup form */}
      {showForm && (
        <div className=" inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl mb-4">Sign Up</h2>

            {!role && (
              <div>
                <button className="mr-4" onClick={() => handleRoleSelect('customer')}>Sign up as Customer</button>
                <button onClick={() => handleRoleSelect('company')}>Sign up as Company</button>
              </div>
            )}

            {role && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label className="block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label className="block">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full" required />
                </div>

                {/* Show security key field only if role is 'company' */}
                {role === 'company' && (
                  <div className="mb-4">
                    <label className="block">Security Key</label>
                    <input type="text" value={securityKey} onChange={(e) => setSecurityKey(e.target.value)} className="border p-2 w-full" required />
                  </div>
                )}

                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
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



          {/* <button className="font-bold">Home</button>
          <button>Services</button>
          <button>About Us</button> */}
