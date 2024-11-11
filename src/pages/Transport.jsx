import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../App.css";
import Ticket from "../components/Ticket/Ticket.jsx";

const TransportGoodies = () => {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [approxWeight, setApproxWeight] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [shippingDate, setShippingDate] = useState("");
  const [image, setImage] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [activeSection, setActiveSection] = useState(1);
  const [allocatedShip, setAllocatedShip] = useState(null);
  const [container, setContainer] = useState(null);

  const sectionRefs = [useRef(null), useRef(null)];

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingNumber = `BOOK-${Math.floor(Math.random() * 900000 + 100000)}`;
    const estimatedCost = (Math.random() * 500).toFixed(2);
    const estimatedTime = `${Math.floor(Math.random() * 10) + 1} days`;

    // Allocate ship and container based on backend response
    const shipDetails = await allocateShipAndContainer();
    setAllocatedShip(shipDetails.shipName);
    setContainer(shipDetails.container);

    console.log("Shipping Date before setting bookingDetails:", shippingDate);
    const bookingInfo = {
      bookingNumber,
      senderName,
      receiverName,
      item,
      category,
      approxWeight,
      source,
      destination,
      estimatedCost,
      estimatedTime,
      shippingDate, // Ensure shippingDate is correct here
    };

    // Log the full bookingInfo object
    console.log("Booking Details:", bookingInfo);

    // Set booking details
    setBookingDetails(bookingInfo);
    const formData = new FormData();
    formData.append("senderName", senderName);
    formData.append("senderEmail", senderEmail);
    formData.append("senderPhone", senderPhone);
    formData.append("senderAddress", senderAddress);
    formData.append("receiverName", receiverName);
    formData.append("receiverEmail", receiverEmail);
    formData.append("receiverPhone", receiverPhone);
    formData.append("receiverAddress", receiverAddress);
    formData.append("item", item);
    formData.append("category", category);
    formData.append("approxWeight", approxWeight);
    formData.append("source", source);
    formData.append("destination", destination);
    // Format shippingDate for consistency (if necessary)
const formattedShippingDate = new Date(shippingDate).toISOString();
formData.append("shippingDate", formattedShippingDate);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/shipping-request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const allocateShipAndContainer = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ports");
      const ports = response.data;

      // Find the source port
      const sourcePort = ports.find((port) => port.Port === source);
      if (!sourcePort) {
        throw new Error("Source port not found.");
      }

      // Check ship availability at the source port
      const availableShips = sourcePort["Vessels In Port"];
      const departuresLast24Hrs = sourcePort["Departures (last 24hrs)"];
      const expectedArrivals = sourcePort["Expected Arrivals"];

      // Estimate departure date
      const departureDate = new Date(shippingDate);
      if (departuresLast24Hrs < expectedArrivals) {
        departureDate.setDate(departureDate.getDate() + 1);
      } else {
        departureDate.setDate(departureDate.getDate() + 2);
      }

      // Choose an available ship and container
      const allocatedShip = availableShips ? availableShips[0] : "Ship TBD";
      const containerOptions = ["A", "B", "C"];
      const allocatedContainer =
        containerOptions[Math.floor(Math.random() * containerOptions.length)];

      // Save allocation to MongoDB
      await axios.post("http://localhost:5000/api/ship-allocations", {
        orderId: `ORDER-${Math.floor(Math.random() * 900000 + 100000)}`,
        sourcePort: sourcePort.Port,
        destinationPort: destination,
        departureDate: departureDate.toISOString(),
        estimatedArrival: new Date(
          departureDate.getTime() +
            Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
        ).toISOString(),
        allocatedShip,
        container: allocatedContainer,
      });

      return { shipName: allocatedShip, container: allocatedContainer };
    } catch (error) {
      console.error("Error allocating ship and container:", error);
      return { shipName: "Unknown", container: "Unknown" };
    }
  };

  const handleScroll = () => {
    const sectionOffsets = sectionRefs.map((ref) => ref.current.offsetTop);
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sectionOffsets.forEach((offset, index) => {
      if (scrollPosition >= offset) {
        setActiveSection(index + 1);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mx-auto w-full max-h-screen overflow-y-auto py-1 relative overflow-hidden TransportGoodiesApp">
      <h1 className="text-3xl font-bold text-center mt-8 mb-6">
        Transport Goodies
      </h1>

      {/* Scroll Indicator */}
      {/* <div className="fixed top-1/2 right-4 transform -translate-y-1/2 space-y-4 z-10">
        {[1, 2].map((section) => (
          <div
            key={section}
            onClick={() => scrollToSection(section - 1)}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
              activeSection === section
                ? "bg-black border-2 border-gray-800"
                : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div> */}

      {!bookingDetails ? (
        <form onSubmit={handleSubmit} className="space-y-6 form-container">
          <div
            // ref={sectionRefs[0]}
            className="max-h-screen flex flex-col justify-center items-center p-6 rounded-lg overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4 text-black">User Info</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-black text-sm">Sender's Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Sender's Email</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Sender's Phone</label>
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Sender's Address</label>
                <input
                  type="text"
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Receiver's Name</label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Receiver's Email</label>
                <input
                  type="email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Receiver's Phone</label>
                <input
                  type="tel"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Receiver's Address</label>
                <input
                  type="text"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div
            ref={sectionRefs[1]}
            className=" max-h-screen flex flex-col justify-center items-center  p-6 rounded-lg overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4 text-black">Shipping Info</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-black text-sm">Item(s)</label>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Approximate Weight (kg)</label>
                <input
                  type="number"
                  value={approxWeight}
                  onChange={(e) => setApproxWeight(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Shipping Date</label>
                <input
                  type="date"
                  value={shippingDate}
                  onChange={(e) => setShippingDate(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm">Image</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded bg-gray-200 text-black font-sm"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Booking Ticket
          </h2>
          <Ticket
            senderName={bookingDetails.senderName}
            receiverName={bookingDetails.receiverName}
            shippingDate={bookingDetails.shippingDate}
            estimatedTime={bookingDetails.estimatedTime}
            estimatedCost={bookingDetails.estimatedCost}
          />
          <h3 className="text-center font-semibold text-xl mt-8">
            Your E-Ticket has been generated!!
          </h3>
        </div>
      )}
    </div>
  );
};

export default TransportGoodies;
