import React from "react";
import  "../App.css";
import MainDash from "./MainDash/MainDash";
import Sidebar from "./Sidebar/Sidebar";


function DashBoard() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <MainDash />
        {/* <RightSide /> */}
      </div>
    </div>
  );
}

export default DashBoard;
