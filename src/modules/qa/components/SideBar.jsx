import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import home from "../../../assets/images/home.svg";
import reportanalysis from "../../../assets/images/reportanalysis.svg";
import logo from "../../../assets/images/logo.svg"
import bug from '../../../assets/images/bug.svg'
import test from '../../../assets/images/test.svg'

const SideBar = ({ setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden md:flex flex-col items-center bg-gray-100 fixed left-0 top-0 h-screen w-40 py-6 shadow-md">
        <img src={logo} className="w-18 h-18 mb-10 " alt="logo" />
        <div className="flex flex-col gap-10 left-end">
          <Link to="/qa_dashboard" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Dashboard")}>
            <img src={home} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Home" />
            <span className="text-sm text-custom1 font-medium">Dashboard</span>
          </Link>
          <Link to="/qa_dashboard/testcase_management" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Testcase Management")}>
            <img src={test} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Project Management" />
            <span className="text-sm text-custom1 font-medium">TestCase management</span>

          </Link>
          <Link to="/qa_dashboard/bug_management" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Bug Management")}>
            <img src={bug} className="w-5 h-5   cursor-pointer hover:opacity-75" alt="Task Management" />
            <span className="text-sm text-custom1 font-medium">Bug management</span>

          </Link>
          <Link to="/qa_dashboard/report_analysis" className="flex items-center gap-3 p-2 hover:bg-gray-200" onClick={() => setSelectedPage("Report Analysis")}>
            <img src={reportanalysis} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Report Analysis" />
            <span className="text-sm text-custom1 font-medium">Report</span>

          </Link>
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
            <Link to="/qa_dashboard" onClick={() => { setSelectedPage("Dashboard"); setIsOpen(false); }}>
              <img src={home} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Home" />
            </Link>
            <Link to="/qa_dashboard/testcase_management" onClick={() => { setSelectedPage("Project Management"); setIsOpen(false); }}>
              <img src={test} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Project Management" />
            </Link>
            <Link to="/projectmanager_dashboard/task_management" onClick={() => { setSelectedPage("Task Management"); setIsOpen(false); }}>
              <img src={bug} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Overview" />
            </Link>
            <Link to="/projectmanager_dashboard/report_analysis" onClick={() => { setSelectedPage("Report Analysis"); setIsOpen(false); }}>
              <img src={reportanalysis} className="w-8 h-8 cursor-pointer hover:opacity-75" alt="Report Analysis" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
