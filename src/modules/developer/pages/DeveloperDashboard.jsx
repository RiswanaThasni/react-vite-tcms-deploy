import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const DeveloperDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  
  // Define page titles based on routes for developer dashboard
  const pageTitles = {
    "/dev_dashboard": "Dashboard",
    "/dev_dashboard/mainsection": "Dashboard",
    "/dev_dashboard/task_details": "Task Details",
    "/dev_dashboard/track_task": "Track Task"
  };
  
  // Dynamic route patterns
  const dynamicRoutes = [
    { pattern: /^\/dev_dashboard\/tasks\/\d+$/, title: "Task Details" }
  ];

  // Update selected page based on current route
  useEffect(() => {
    let title = pageTitles[location.pathname];
    
    // If no exact match, check for dynamic routes
    if (!title) {
      const dynamicMatch = dynamicRoutes.find(route => 
        route.pattern.test(location.pathname)
      );
      
      if (dynamicMatch) {
        title = dynamicMatch.title;
      } else {
        // Default fallback
        title = "Dashboard";
      }
    }
    
    setSelectedPage(title);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-mainsection">
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "ml-52" : "ml-16"
      }`}>
        <NavBar
          selectedPage={selectedPage}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-6 mt-16 rounded-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default DeveloperDashboard;