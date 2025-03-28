// import React, { useEffect, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import SideBar from "../components/SideBar";
// import NavBar from "../components/NavBar";



// const AdminDashboard = () => {
//   const location = useLocation()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);


//   const pageTitles = {
//     "/admin_dashboard/mainsection": "Dashboard",
//     "/admin_dashboard/user_management": "User Management",
//     "/admin_dashboard/view_user_details/:userId": "User Details",
//     "/admin_dashboard/overview": "View Project",
//     "/admin_dashboard/project_details/:projectId" : "Project Details",
//     "/admin_dashboard/report_analysis": "Report Analysis",
//   };



//   const selectedPage = Object.keys(pageTitles).find((path) =>
//     location.pathname.startsWith(path)
//   )
//     ? pageTitles[location.pathname]
//     : "Dashboard";

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="flex min-h-screen bg-white">
//            <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      
//       <div className="flex-1 flex flex-col">
//         <NavBar 
//           selectedPage={selectedPage} 
//           toggleSidebar={toggleSidebar}
//         />
        
//         <main className="flex-1 p-4 md:ml-20 mt-16">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from "react"; 
import { Outlet, useLocation, useParams } from "react-router-dom"; 
import SideBar from "../components/SideBar"; 
import NavBar from "../components/NavBar";    

const AdminDashboard = () => {
   const location = useLocation();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

export default AdminDashboard;