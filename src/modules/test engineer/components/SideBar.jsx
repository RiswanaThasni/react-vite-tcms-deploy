import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import home from "../../../assets/images/home.svg";
import logo from "../../../assets/images/logo.svg"
import projectmanagement from '../../../assets/images/projectmanagement.svg'
import taskmanagement from '../../../assets/images/taskmanagement.svg'
import test from '../../../assets/images/test.svg'
import { FaSpinner } from "react-icons/fa"
import { GiProgression } from "react-icons/gi"




const SideBar = ({ setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden md:flex flex-col items-center bg-gray-100 fixed left-0 top-0 h-screen w-40 py-6 shadow-md">
        <img src={logo} className="w-18 h-18 mb-10 " alt="logo" />
        <div className="flex flex-col gap-10 left-end">
          <Link to="/testengineer_dashboard" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Dashboard")}>
            <img src={home} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Home" />
            <span className="text-sm text-custom1 font-medium">Home</span>
          </Link>
          <Link to="/testengineer_dashboard/test_details" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Test Details")}>
            <img src={test} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Project Management" />
            <span className="text-sm text-custom1 font-medium">Test Details</span>

          </Link>
          <Link to="/testengineer_dashboard/test_track" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Test Tracking")}>
          <GiProgression size={20} className=" text-violet-950" />
          <span className="text-sm text-custom1 font-medium">Track Test</span>
          </Link>
          {/* <Link to="/projectmanager_dashboard/report_analysis" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Report Analysis")}>
            <img src={reportanalysis} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Report Analysis" />
            <span className="text-sm text-custom1 font-medium">Report</span>

          </Link> */}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button className="fixed top-4 left-4 z-[1000] p-2 bg-white shadow-md rounded-md" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} className="text-custom" /> : <FiMenu size={24} className="text-custom" />}
        </button>

        {isOpen && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}

        <div className={`fixed top-0 left-0 h-screen w-20 bg-white shadow-lg transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col items-center py-20 mt-8 space-y-10">
            <Link to="/projectmanager_dashboard" onClick={() => { setSelectedPage("Dashboard"); setIsOpen(false); }}>
              <img src={home} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Home" />
            </Link>
            <Link to="/projectmanager_dashboard/project_management" onClick={() => { setSelectedPage("Project Management"); setIsOpen(false); }}>
              <img src={projectmanagement} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Project Management" />
            </Link>
            <Link to="/projectmanager_dashboard/task_management" onClick={() => { setSelectedPage("Task Management"); setIsOpen(false); }}>
              <img src={taskmanagement} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Overview" />
            </Link>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
