import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const ProjectManagerDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageTitles = {
    "/projectmanager_dashboard/mainsection": "Dashboard",
    "/projectmanager_dashboard/project_management": "Project Management",
    "/projectmanager_dashboard/create_project": "Create Project",
    "/projectmanager_dashboard/project_details/:projectId": "Project Details",
    "/projectmanager_dashboard/task_management": "Task Management",
    "/projectmanager_dashboard/report_analysis": "Report ",
  };

  const getPageTitle = () => {
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];

    if (/^\/projectmanager_dashboard\/project_details\/\d+$/.test(location.pathname)) {
      return "Project Details";
    }

    return "Dashboard";
  };
  
  const selectedPage = getPageTitle();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when window is resized to larger size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <NavBar
          selectedPage={selectedPage}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-4 md:ml-20 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;