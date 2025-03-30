// AdminDashboard.jsx - Updated
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const AdminDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const pageTitles = {
    "/admin_dashboard/mainsection": "Dashboard",
    "/admin_dashboard/user_management": "User Management",
    "/admin_dashboard/view_user_details/:userId": "User Details",
    "/admin_dashboard/overview": "View Project",
    "/admin_dashboard/project_details/:projectId": "Project Details",
    "/admin_dashboard/report_analysis": "Report Analysis",
  };
  
  const getPageTitle = () => {
    // Check for exact matches first
    const exactMatch = Object.keys(pageTitles).find(path => 
      location.pathname === path.replace(':userId', '') ||
      location.pathname === path.replace(':projectId', '')
    );
    
    if (exactMatch) return pageTitles[exactMatch];
    
    // Check for routes with dynamic segments
    const dynamicRoutes = [
      { pattern: /^\/admin_dashboard\/view_user_details\/\d+$/, title: "User Details" },
      { pattern: /^\/admin_dashboard\/project_details\/\d+$/, title: "Project Details" }
    ];
    
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

export default AdminDashboard;