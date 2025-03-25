import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";


const ProjectManagerDashboard = () => {
const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem("selectedPage") || "Dashboard"
  );

   useEffect(() => {
      localStorage.setItem("selectedPage", selectedPage);
    }, [selectedPage]);


  return (
    <div className="flex min-h-screen bg-white ">
      <SideBar setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col">
        <NavBar selectedPage={selectedPage} />
        <main className="p-6 mt-16 md:ml-40">
        <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
