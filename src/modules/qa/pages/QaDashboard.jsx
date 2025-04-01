import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const QaDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Page titles mapping
  const pageTitles = {
    "/qa_dashboard": "Dashboard",
    "/qa_dashboard/testcase_management": "TestCase Management",
    "/qa_dashboard/bug_management": "Bug Management",
    "/qa_dashboard/report_analysis": "Report Analysis",
  };
  
  // Dynamic routes patterns for detail pages
  const dynamicRoutes = [
    { pattern: /^\/qa_dashboard\/testcase_details\/\d+$/, title: "TestCase Details" },
    { pattern: /^\/qa_dashboard\/bug_details\/\d+$/, title: "Bug Details" }
  ];
  
  // Function to determine the current page title based on location
  const getPageTitle = () => {
    // Check for exact matches first
    const exactPath = Object.keys(pageTitles).find(path => 
      location.pathname === path || location.pathname === `${path}/`
    );
    
    if (exactPath) return pageTitles[exactPath];
    
    // Check for dynamic routes with IDs
    const dynamicMatch = dynamicRoutes.find(route => 
      route.pattern.test(location.pathname)
    );
    
    if (dynamicMatch) return dynamicMatch.title;
    
    // Default to dashboard if no match found
    return "Dashboard";
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
        <SideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
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

export default QaDashboard;