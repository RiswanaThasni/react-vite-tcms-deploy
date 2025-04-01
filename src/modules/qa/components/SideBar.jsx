

// import React, { useState } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import home from "../../../assets/images/home.svg";
// import reportanalysis from "../../../assets/images/reportanalysis.svg";
// import logo from "../../../assets/images/logo.svg";
// import logout from "../../../assets/images/logout.svg";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../../redux/slices/userSlice";
// import test from '../../../assets/images/test.svg'
// import bug from '../../../assets/images/bug.svg'

// const SideBar = ({ setSelectedPage }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [hoverLogout, setHoverLogout] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleNavigation = (page, path) => {
//     setSelectedPage(page);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate("/");
//   };

//   const NavButton = ({ icon, alt, page, path }) => (
//     <div className="relative">
//       <button
//         onClick={() => handleNavigation(page, path)}
//         onMouseEnter={() => setHoveredItem(page)}
//         onMouseLeave={() => setHoveredItem(null)}
//         className="flex items-center justify-center p-2 hover:bg-gray-200 relative"
//       >
//         <img src={icon} className="w-5 h-5 cursor-pointer hover:opacity-75" alt={alt} />
//         {hoveredItem === page && (
//           <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
//             {page}
//           </span>
//         )}
//       </button>
//     </div>
//   );

//   return (
//     <>
//        <div className="hidden md:flex flex-col items-center bg-gray-100 fixed left-0 top-0 h-full w-20 py-6">
//               <img src={logo} className="w-18 h-18 mb-10" alt="logo" />
              
//               <div className="flex flex-col flex-grow items-center gap-4">
//    <NavButton icon={home} alt="Home" page="Dashboard" path="/qa_dashboard" />
//     <NavButton icon={test} alt="TestCase Management" page="TestCase Management" path="/qa_dashboard/testcase_management" />
//     <NavButton icon={bug} alt="Bug Management" page="Bug Management" path="/qa_dashboard/bug_management" />
//     <NavButton icon={reportanalysis} alt="Report Analysis" page="Report Analysis" path="/qa_dashboard/report_analysis" />
//   </div>

//   {/* Logout Button at Bottom */}
//   <div className="mt-auto ">
//     <button
//       onClick={handleLogout}
//       onMouseEnter={() => setHoverLogout(true)}
//       onMouseLeave={() => setHoverLogout(false)}
//       className="flex items-center justify-center p-2 hover:bg-gray-200 relative"
//     >
//       <img src={logout} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Logout" />
//       {hoverLogout && (
//         <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
//           Logout
//         </span>
//       )}
//     </button>
//   </div>
// </div>





//       {/* Mobile Sidebar */}
//       <div className="md:hidden">
//         <button className="fixed top-4 left-4 z-[1000] p-2 bg-white rounded-md" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <FiX size={24} className="text-custom" /> : <FiMenu size={24} className="text-custom" />}
//         </button>

//         {isOpen && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}

//         <div
//           className={`fixed top-0 left-0 h-full w-20 bg-white shadow-lg transition-transform duration-300 z-50 
//             ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
//         >
//           <div className="flex flex-col flex-grow items-center gap-4">
//             <NavButton icon={home} alt="Home" page="Dashboard" path="/qa_dashboard" />
//             <NavButton icon={test} alt="Testcase Management" page="TestCase Management" path="/qa_dashboard/testcase_management" />
//             <NavButton icon={bug} alt="Bug Management" page="Bug Management" path="/qa_dashboard/bug_management" />
//             <NavButton icon={reportanalysis} alt="Report Analysis" page="Report Analysis" path="/qa_dashboard/report_analysis" />
//           </div>

//           {/* Logout Button at Bottom */}
//           <button
//             onClick={handleLogout}
//             onMouseEnter={() => setHoverLogout(true)}
//             onMouseLeave={() => setHoverLogout(false)}
//             className="mt-auto mb-4 flex items-center justify-center p-2 hover:bg-gray-200 relative"
//           >
//             <img src={logout} className="w-5 h-5 cursor-pointer hover:opacity-75" alt="Logout" />
//             {hoverLogout && (
//               <span className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
//                 Logout
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SideBar;


import React from "react";
import { FiMenu, FiX, FiGrid, FiFileText,FiAlertCircle, FiBarChart2, FiLogOut } from "react-icons/fi";
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
      path === "/qa_dashboard" 
        ? ["/qa_dashboard", "/qa_dashboard/", "/qa_dashboard/mainsection"].includes(location.pathname)
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
            <NavButton Icon={FiGrid} alt="Dashboard" path="/qa_dashboard" />
            <NavButton Icon={FiFileText} alt="Test Case " path="/qa_dashboard/testcase_management" />
            <NavButton Icon={FiAlertCircle} alt="Bugs " path="/qa_dashboard/bug_management" />
            <NavButton Icon={FiBarChart2} alt="Report " path="/qa_dashboard/report_analysis" />
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
            <NavButton Icon={FiGrid} alt="Dashboard" path="/qa_dashboard" />
            <NavButton Icon={FiFileText} alt="TestCase" path="/qa_dashboard/testcase_management" />
            <NavButton Icon={FiAlertCircle} alt="Bug " path="/qa_dashboard/bug_management" />
            <NavButton Icon={FiBarChart2} alt="Report " path="/qa_dashboard/report_analysis" />
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