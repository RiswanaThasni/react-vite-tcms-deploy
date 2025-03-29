import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import home from "../../../assets/images/home.svg";
import reportanalysis from "../../../assets/images/reportanalysis.svg";
import logo from "../../../assets/images/logo.svg";
import usermanagement from "../../../assets/images/usermanagement.svg";
import overview from "../../../assets/images/overview.svg";
import logout from "../../../assets/images/logout.svg";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/userSlice";



const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverLogout, setHoverLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const NavButton = ({ icon, alt, path }) => {
    const isActive = location.pathname.startsWith(path);
    const [isHovered, setIsHovered] = useState(false);
  
    return (
<div className="relative flex flex-col items-center">
<button
          onClick={() => handleNavigation(path)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center p-2 hover:bg-gray-200 relative 
            ${isActive ? 'bg-blue-100' : ''}`}
        >
          <img 
            src={icon} 
            className="w-5 h-5 cursor-pointer hover:opacity-75" 
            alt={alt} 
          />
          {/* Tooltip should appear when hovered */}
          {isHovered && (
  <span className="absolute left-[110%] top-1/2 transform -translate-y-1/2
                 bg-black text-white text-xs px-2 py-1 rounded shadow-lg 
                 whitespace-nowrap z-50">
    {alt}
  </span>
)}

        </button>
      </div>
    );
  };
  

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden md:flex flex-col items-center bg-gray-100 fixed left-0 top-0 h-full w-20 py-6
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
">
        <img src={logo} className="w-18 h-18 mb-18" alt="logo" />
        
        {/* Navigation Buttons */}
        <div className="flex flex-col flex-grow items-center gap-4">
          <NavButton icon={home} alt="Home" page="Dashboard" path="/admin_dashboard" />
          <NavButton icon={usermanagement} alt="User Management" page="User Management" path="/admin_dashboard/user_management" />
          <NavButton icon={overview} alt="View project" page="View Project" path="/admin_dashboard/overview" />
          <NavButton icon={reportanalysis} alt="Report Analysis" page="Report" path="/admin_dashboard/report_analysis" />
        </div>

        {/* Logout Button at Bottom */}
        <div className="mt-auto ">
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            className="flex items-center justify-center p-2 hover:bg-gray-200 relative"
          >
            <img src={logout} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Logout" />
            {hoverLogout && (
              <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button className="fixed top-4 left-4 z-[1000] p-2 bg-white rounded-md"          
         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
>
          {isSidebarOpen ? <FiX size={24} className="text-custom" /> : <FiMenu size={24} className="text-custom" />}
          </button>

          {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <div
          className={`fixed top-0 left-0 h-full w-20 bg-white shadow-lg transition-transform duration-300 z-50 
         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}        >
          <div className="flex flex-col flex-grow items-center gap-4">
            <NavButton icon={home} alt="Home" page="Dashboard" path="/admin_dashboard" />
            <NavButton icon={usermanagement} alt="Project Management" page="Project Management" path="/admin_dashboard/user_management" />
            <NavButton icon={overview} alt="Task Management" page="Task Management" path="/admin_dashboard/overview" />
            <NavButton icon={reportanalysis} alt="Report Analysis" page="Report Analysis" path="/admin_dashboard/report_analysis" />
          </div>

          {/* Logout Button at Bottom */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            className="mt-auto mb-4 flex items-center justify-center p-2 hover:bg-gray-200 relative"
          >
            <img src={logout} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Logout" />
            {hoverLogout && (
              <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
