import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const ProjectManagerDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const pageTitles = {
    "/projectmanager_dashboard/mainsection": "Dashboard",
    "/projectmanager_dashboard/project_management": "Project Management",
    "/projectmanager_dashboard/create_project": "Create Project",
    "/projectmanager_dashboard/project_details/:projectId": "Project Details",
    "/projectmanager_dashboard/task_management": "Tasks",
    "/projectmanager_dashboard/bug_assignment": "Reassign Bug",
    "/projectmanager_dashboard/report_analysis": "Report",
    "/projectmanager_dashboard/bug_detail/:bugId": "Bug Details",
    
  };
  
  const getPageTitle = () => {
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];
    
    if (/^\/projectmanager_dashboard\/project_details\/\d+$/.test(location.pathname)) {
      return "Project Details";
    }

    if (/^\/projectmanager_dashboard\/bug_detail\/\d+$/.test(location.pathname)) {
      return "Bug Details";
    }
    
    return "Dashboard";
  };
  
  const selectedPage = getPageTitle();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Close sidebar when window is resized to smaller size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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

export default ProjectManagerDashboard;