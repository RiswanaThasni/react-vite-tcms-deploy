import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";  //  Import useNavigate
import home from "../../../assets/images/home.svg";
import reportanalysis from "../../../assets/images/reportanalysis.svg";
import logo from "../../../assets/images/logo.svg";
import usermanagement  from "../../../assets/images/usermanagement.svg";
import overview from "../../../assets/images/overview.svg";

const SideBar = ({ setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();  //  Initialize useNavigate

  

  const handleNavigation = (page, path) => {
    setSelectedPage(page);  // Update state before navigation
    navigate(path);
  };

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden md:flex flex-col items-center bg-gray-100 fixed left-0 top-0 h-screen w-40 py-6 shadow-md">
        <img src={logo} className="w-18 h-18 mb-10" alt="logo" />
        <div className="flex flex-col  left-end gap-10 ">
          <button onClick={() => handleNavigation("Dashboard", "/admin_dashboard")}
            className="flex items-center gap-3 p-2 hover:bg-gray-200">
            <img src={home} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Home" />
            <span className="text-sm text-custom1 font-medium">Home</span>
          </button>

          <button onClick={() => handleNavigation("User Management", "/admin_dashboard/user_management")}
            className="flex items-center gap-3 p-2 hover:bg-gray-200">
            <img src={usermanagement} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="User Management" />
            <span className="text-sm text-custom1 font-medium">User Management</span>
          </button>

          <button onClick={() => handleNavigation("View project", "/admin_dashboard/overview")}
            className="flex  gap-3 p-2 hover:bg-gray-200">
            <img src={overview} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="View project" />
            <span className="text-sm text-custom1 font-medium">View Project</span>
          </button>

          <button onClick={() => handleNavigation("Report Analysis", "/admin_dashboard/report_analysis")}
            className="flex items-center gap-3 p-2 hover:bg-gray-200">
            <img src={reportanalysis} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Report Analysis" />
            <span className="text-sm text-custom1 font-medium">Report</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button className="fixed top-4 left-4 z-[1000] p-2 bg-white shadow-md rounded-md" 
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} className="text-custom" /> : <FiMenu size={24} className="text-custom" />}
        </button>

        {isOpen && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}

        <div className={`fixed top-0 left-0 h-screen w-20 bg-white shadow-lg transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col items-center py-20 mt-8 space-y-10">
            <button onClick={() => { handleNavigation("Dashboard", "/projectmanager_dashboard"); setIsOpen(false); }}>
              <img src={home} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Home" />
            </button>
            <button onClick={() => { handleNavigation("Project Management", "/projectmanager_dashboard/project_management"); setIsOpen(false); }}>
              <img src={home} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Project Management" />
            </button>
            <button onClick={() => { handleNavigation("Task Management", "/projectmanager_dashboard/task_management"); setIsOpen(false); }}>
              <img src={home} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Task Management" />
            </button>
            <button onClick={() => { handleNavigation("Report Analysis", "/projectmanager_dashboard/report_analysis"); setIsOpen(false); }}>
              <img src={reportanalysis} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Report Analysis" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
