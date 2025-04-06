// // import React, { useEffect, useState } from "react";
// // import { Outlet } from "react-router-dom";
// // import SideBar from "../components/SideBar";
// // import NavBar from "../components/NavBar";


// // const TestEngineerDashboard = () => {
// // const [selectedPage, setSelectedPage] = useState(
// //     localStorage.getItem("selectedPage") || "Dashboard"
// //   );

// //    useEffect(() => {
// //       localStorage.setItem("selectedPage", selectedPage);
// //     }, [selectedPage]);
// //   return (
// //     <div className="flex min-h-screen bg-white ">
// //       <SideBar setSelectedPage={setSelectedPage} />
// //       <div className="flex-1 flex flex-col">
// //         <NavBar selectedPage={selectedPage} />
// //         <main className="p-6 mt-16 md:ml-40">
// //         <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TestEngineerDashboard


// import React, { useState, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import SideBar from "../components/SideBar";
// import NavBar from "../components/NavBar";

// const TestEngineerDashboard = () => {
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(
//     localStorage.getItem("sidebarState") === "closed" ? false : true
//   );
  
//   // Define page titles based on routes for test engineer dashboard
//   const pageTitles = {
//     "/test_dashboard": "Dashboard",
//     "/test_dashboard/tests": "Test Cases",
//     "/test_dashboard/reports": "Test Reports",
//     "/test_dashboard/executions": "Test Executions",
//     "/test_dashboard/settings": "Settings"
//   };
  
//   // Dynamic route patterns for test engineer routes
//   const dynamicRoutes = [
//     { pattern: /^\/test_dashboard\/tests\/\d+$/, title: "Test Case Details" },
//     { pattern: /^\/test_dashboard\/reports\/\d+$/, title: "Report Details" },
//     { pattern: /^\/test_dashboard\/executions\/\d+$/, title: "Execution Details" }
//   ];

//   // Function to get the page title based on current route
//   const getPageTitle = () => {
//     const exactMatch = pageTitles[location.pathname];
    
//     if (exactMatch) return exactMatch;
    
//     // If no exact match, check for dynamic routes
//     const dynamicMatch = dynamicRoutes.find(route =>
//       route.pattern.test(location.pathname)
//     );
    
//     return dynamicMatch ? dynamicMatch.title : "Dashboard";
//   };

//   const selectedPage = getPageTitle();

//   // Toggle sidebar state
//   const toggleSidebar = () => {
//     const newState = !isSidebarOpen;
//     setIsSidebarOpen(newState);
//     localStorage.setItem("sidebarState", newState ? "open" : "closed");
//   };
  
//   // Save the current page in localStorage to persist across refreshes
//   useEffect(() => {
//     localStorage.setItem("selectedPage", selectedPage);
//   }, [selectedPage]);
  
//   return (
//     <div className="flex min-h-screen bg-mainsection">
//       {/* Overlay for mobile when sidebar is open */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
//           onClick={toggleSidebar}
//         />
//       )}
      
//       {/* Sidebar with responsive behavior */}
//       <div className={`fixed top-0 h-full z-50 transition-all duration-300 ${
//         isSidebarOpen ? "w-52" : "w-16"
//       }`}>
//         <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
//       </div>
      
//       {/* Main Content Area */}
//       <div className={`flex-1 flex flex-col transition-all duration-300 ${
//         isSidebarOpen ? "ml-52" : "ml-16"
//       }`}>
//         <NavBar
//           selectedPage={selectedPage}
//           toggleSidebar={toggleSidebar}
//         />
//         <main className="flex-1 p-3 mt-14 rounded-lg">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default TestEngineerDashboard;




import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const TestEngineerDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem("sidebarState") === "closed" ? false : true
  );
  
  // Define page titles based on routes for test engineer dashboard
  const pageTitles = {
    "/testengineer_dashboard": "Dashboard",
    "/testengineer_dashboard/mainsection": "Dashboard",
    "/testengineer_dashboard/test_details": "Tests",
    "/testengineer_dashboard/test_track": "Track Test"
  };
  
  // Dynamic route patterns for test engineer routes
  const dynamicRoutes = [
    { pattern: /^\/testengineer_dashboard\/tests\/\d+$/, title: "Test Case Details" },
    { pattern: /^\/testengineer_dashboard\/tests\/bugs\/\d+$/, title: "Bug Details" }
  ];
  
  // Function to get the page title based on current route
  const getPageTitle = () => {
    // Check for exact match first
    const exactMatch = pageTitles[location.pathname];
    if (exactMatch) return exactMatch;
    
    // If no exact match, check for dynamic routes
    const dynamicMatch = dynamicRoutes.find(route =>
      route.pattern.test(location.pathname)
    );
    
    return dynamicMatch ? dynamicMatch.title : "Dashboard";
  };
  
  const selectedPage = getPageTitle();
  
  // Toggle sidebar state
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarState", newState ? "open" : "closed");
  };
  
  // Effect to track route changes and update page title
  useEffect(() => {
    // This ensures the title updates whenever the location changes
    const pageTitle = getPageTitle();
    localStorage.setItem("selectedPage", pageTitle);
  }, [location.pathname]);
  
  return (
    <div className="flex min-h-screen bg-mainsection">
      {/* Sidebar component */}
      <SideBar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-52" : "ml-16"
        } md:${isSidebarOpen ? "ml-50" : "ml-16"}`}
      >
        <NavBar
          selectedPage={selectedPage}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-3 mt-16 rounded-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TestEngineerDashboard;