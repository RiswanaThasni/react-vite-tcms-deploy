import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import home from "../../../assets/images/home.svg";
import logo from "../../../assets/images/logo.svg"
import projectmanagement from '../../../assets/images/projectmanagement.svg'
import taskmanagement from '../../../assets/images/taskmanagement.svg'
import { GiProgression } from "react-icons/gi";
import { useDispatch } from "react-redux";
import logout from "../../../assets/images/logout.svg";





const SideBar = ({ setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverLogout, setHoverLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (page, path) => {
      setSelectedPage(page);
      navigate(path);
    };
  
    const handleLogout = () => {
      dispatch(logoutUser());
      navigate("/");
    };
    const NavButton = ({ icon, alt, page, path }) => (
      <div className="relative">
        <button
          onClick={() => handleNavigation(page, path)}
          onMouseEnter={() => setHoveredItem(page)}
          onMouseLeave={() => setHoveredItem(null)}
          className="flex items-center justify-center p-2 hover:bg-gray-200 relative"
        >
          <img src={icon} className="w-5 h-5 cursor-pointer hover:opacity-75" alt={alt} />
          {hoveredItem === page && (
            <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {page}
            </span>
          )}
        </button>
      </div>
    );

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden md:flex flex-col items-center bg-gray-100 fixed left-0 top-0 h-screen w-40 py-6 shadow-md">
        <img src={logo} className="w-18 h-18 mb-10 " alt="logo" />
        <div className="flex flex-col flex-grow items-center gap-4">
                  <NavButton icon={home} alt="Home" page="Dashboard" path="/dev_dashboard" />
                  <NavButton icon={taskmanagement} alt="Task Details" page="Task Details" path="/dev_dashboard/task_details" />
                  <NavButton icon={GiProgression} alt="Track Task" page="Track Task" path="/dev_dashboard/track_task" />
                </div>
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
              <button className="fixed top-4 left-4 z-[1000] p-2 bg-white rounded-md" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FiX size={24} className="text-custom" /> : <FiMenu size={24} className="text-custom" />}
              </button>
      
              {isOpen && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
      
              <div
                className={`fixed top-0 left-0 h-full w-20 bg-white shadow-lg transition-transform duration-300 z-50 
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
              >
                <div className="flex flex-col flex-grow items-center gap-4">
                  <NavButton icon={home} alt="Home" page="Dashboard" path="/dev_dashboard" />
                  <NavButton icon={taskmanagement} alt="Task Details" page="Task Details" path="/dev_dashboard/task_details" />
                  <NavButton icon={GiProgression} alt="Track Task" page="Track Task" path="/dev_dashboard/track_task" />
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
