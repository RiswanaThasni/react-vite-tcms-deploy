import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const DeveloperDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Define page titles based on routes for developer dashboard
  const pageTitles = {
    "/dev_dashboard": "Dashboard",
    "/dev_dashboard/mainsection": "Dashboard",
    "/dev_dashboard/task_details": "Tasks",
    "/dev_dashboard/track_task": "Track Task",
    // "/dev_dashboard/reassign_task" : "Fix Bug ",
  };
  
  // Dynamic route patterns
  const dynamicRoutes = [
    { pattern: /^\/dev_dashboard\/tasks\/\d+$/, title: "Task Details" },
    // { pattern: /^\/dev_dashboard\/fix_bugs\/\d+$/, title: "detailed bug" }

  ];

  // Function to get the page title based on current route
  const getPageTitle = () => {
    const exactMatch = pageTitles[location.pathname];
    
    if (exactMatch) return exactMatch;
    
    // If no exact match, check for dynamic routes
    const dynamicMatch = dynamicRoutes.find(route =>
      route.pattern.test(location.pathname)
    );
    
    return dynamicMatch ? dynamicMatch.title : "Dashboard";
  };

  const selectedPage = getPageTitle();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-mainsection">
      {/* Sidebar */}
      <div className={`fixed top-0 h-full z-50 transition-all duration-300 ${
        isSidebarOpen ? "w-52" : "w-16"
      }`}>
        <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "ml-52" : "ml-16"
      }`}>
        <NavBar
          selectedPage={selectedPage}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-3 mt-14 rounded-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeveloperDashboard;