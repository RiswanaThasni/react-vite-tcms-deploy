import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem("selectedPage") || "Dashboard"
  );

  useEffect(() => {
    localStorage.setItem("selectedPage", selectedPage);
  }, [selectedPage]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <SideBar 
        setSelectedPage={setSelectedPage} 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col">
        <NavBar 
          selectedPage={selectedPage} 
          toggleSidebar={toggleSidebar}
        />
        
        <main className="flex-1 p-4 md:ml-20 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;