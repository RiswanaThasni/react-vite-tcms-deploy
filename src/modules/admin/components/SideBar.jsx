import React from "react";
import { FiMenu, FiX, FiUsers, FiFileText, FiBarChart2, FiLogOut, FiGrid } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.svg";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/userSlice";



const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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

  const NavButton = ({ Icon, alt, path }) => {
    const isActive = 
      path === "/admin_dashboard" 
        ? ["/admin_dashboard", "/admin_dashboard/", "/admin_dashboard/mainsection"].includes(location.pathname)
        : location.pathname === path;
    
    return (
      <div className="w-full mb-4">
        <button
          onClick={() => handleNavigation(path)}
          className={`flex items-center w-full p-2 rounded-full transition-colors duration-200 ${
            isActive ? 'bg-sidebar-hover' : 'hover:bg-sidebar-hover'
          }`}
        >
          <Icon 
            className={`w-5 h-5 ${
              isActive ? 'text-black' : 'text-white'
            }`}
          />
          <span className={`ml-2 text-sm ${
            isActive ? 'text-black font-medium' : 'text-white'
          }`}>{alt}</span>
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className={`hidden md:flex flex-col justify-between rounded-2xl p-4 bg-sidebar fixed top-3.5 left-3 h-[95vh] ${
        isSidebarOpen ? 'w-50' : 'w-16'
      } py-6 shadow-lg z-50 transition-all duration-300`}>
        <div className="flex flex-col items-center">
          <img src={logo} className="w-16 h-16 mb-8" alt="logo" />
          
          {/* Navigation Buttons */}
          <div className="flex flex-col flex-grow items-start w-full">
            <NavButton Icon={FiGrid} alt="Dashboard" path="/admin_dashboard" />
            <NavButton Icon={FiUsers} alt="User " path="/admin_dashboard/user_management" />
            <NavButton Icon={FiFileText} alt="Project" path="/admin_dashboard/overview" />
            <NavButton Icon={FiBarChart2} alt="Report " path="/admin_dashboard/report_analysis" />
          </div>
        </div>

        {/* Logout Button at Bottom */}
        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-md transition-colors duration-200 hover:bg-sidebar-hover group"
          >
            <FiLogOut className="w-5 h-5 text-white group-hover:text-lime-300" />
            <span className="ml-2 text-sm text-white group-hover:text-lime-300">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button 
          className="fixed top-4 left-4 z-[1000] p-2 bg-white rounded-md"          
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
          className={`fixed top-0 left-0 h-full w-auto bg-white shadow-lg transition-transform duration-300 z-50 p-4 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col items-start gap-4 mt-16">
            <NavButton Icon={FiGrid} alt="Dashboard" path="/admin_dashboard" />
            <NavButton Icon={FiUsers} alt="User " path="/admin_dashboard/user_management" />
            <NavButton Icon={FiFileText} alt="Project" path="/admin_dashboard/overview" />
            <NavButton Icon={FiBarChart2} alt="Report " path="/admin_dashboard/report_analysis" />
          </div>

          {/* Logout Button at Bottom */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center p-2 rounded-md w-full fixed bottom-4 left-4 right-4 transition-colors duration-200 hover:bg-sidebar-hover group"
          >
            <FiLogOut className="w-5 h-5 text-gray-700 group-hover:text-black" />
            <span className="ml-2 text-sm text-gray-700 group-hover:text-black">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;