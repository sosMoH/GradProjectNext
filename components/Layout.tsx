import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#04070C] overflow-hidden">
      
      {/* 1. The Sidebar (Handles its own mobile fixed positioning) */}
      <Sidebar />

      {/* 2. Main content area */}
      {/* Added pb-[70px] on mobile so you can scroll to the very bottom above the navbar */}
      <div className="flex-1 h-full overflow-y-auto relative pb-[70px] md:pb-0">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;