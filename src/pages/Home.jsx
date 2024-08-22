import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
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
            background: 'linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))',
          }}
        ></div>

        {/* Text Over the Image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center " style={{marginBottom:'16rem'}}>
          <div className="text-center">
            <h1 className="text-cyan-700 text-3xl font-bold mb-2">
              EXPLORE
            </h1>
            <p className="text-neutral-700 font-bold text-6xl">
              AquaLogix
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
