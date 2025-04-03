// import React, { useEffect, useState } from "react";
// import { Search, BarChart2, User, ChevronLeft, ChevronRight, Clipboard, Clock, CheckCircle } from "lucide-react";
// import { RecentActivityAdmin, SummaryCardsByAdmin } from "../../../api/projectApi";
// import { useNavigate } from "react-router-dom";
// import UserAnalysisChart from '../../admin/pages/UserAnalysisChart'
// import { fetchUsers } from "../../../redux/slices/userSlice";
// import { useDispatch, useSelector } from "react-redux";


// const MainSection = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [summaryData, setSummaryData] = useState([]);
//   const [recentProjects, setRecentProjects] = useState([]);
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState({
//     summary: true,
//     activities: true
//   });


//   const [visibleUsersCount, setVisibleUsersCount] = useState(4);
//   const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);

//   const dispatch = useDispatch()
//   const { users, loading: usersLoading } = useSelector(state => state.user)


  
//   const [error, setError] = useState({
//     summary: null,
//     activities: null
//   });

  
//   // Fetch data on component mount
//   useEffect(() => {
//     fetchSummaryData();
//     fetchRecentActivities();
//     dispatch(fetchUsers())
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("recntproject",recentProjects)
//   }, [recentProjects]);
//   // Fetch summary cards data
//   const fetchSummaryData = async () => {
//     try {
//       setLoading(prev => ({ ...prev, summary: true }));
//       const data = await SummaryCardsByAdmin();
      
//       // Format the data for project tab based on backend response
//       const projectData = [
//         { 
//           label: "Total Projects", 
//           count: data.total_projects, 
//           className: "bg-[#D0D4FF]",
//           icon: <Clipboard className="text-blue-700" size={18}   strokeWidth={3}/>
//         },
//         { 
//           label: "Pending Projects", 
//           count: data.pending_projects, 
//           className: "bg-[#D0D4FF]",
//           icon: <Clock className="text-red-800 " size={18} strokeWidth={3}/>
//         },
//         { 
//           label: "Completed Projects", 
//           count: data.completed_projects, 
//           className: "bg-[#D0D4FF]",
//           icon: <CheckCircle className="text-green-600 " size={18} strokeWidth={3} />
//         },
//       ];

//       setSummaryData(projectData);
//       setError(prev => ({ ...prev, summary: null }));
//     } catch (err) {
//       console.error("Error fetching summary data:", err);
//       setError(prev => ({ ...prev, summary: "Failed to load summary data" }));
//     } finally {
//       setLoading(prev => ({ ...prev, summary: false }));
//     }
//   };

//   // Fetch recent activities data
//   const fetchRecentActivities = async () => {
//     try {
//       setLoading(prev => ({ ...prev, activities: true }));
//       const data = await RecentActivityAdmin();
//       setRecentProjects(data);
//       setError(prev => ({ ...prev, activities: null }));
//     } catch (err) {
//       console.error("Error fetching recent activities:", err);
//       setError(prev => ({ ...prev, activities: "Failed to load recent activities" }));
//     } finally {
//       setLoading(prev => ({ ...prev, activities: false }));
//     }
//   };

//   const handleRowClick = (projectId) => {
//     navigate(`/admin_dashboard/project_details/${projectId}`);
//   };

//   const handleUserClick = (userId) => {
//     navigate(`/admin_dashboard/view_user_details/${userId}`)  };

//   // Filter projects based on search query
//   const filteredProjects = recentProjects.filter((project) =>
//     project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
//   );




//   const currentUsers = users && users.length > 0 ? users.slice(0, visibleUsersCount) : [];
  
//   // Handle loading more users
//   const handleLoadMoreUsers = () => {
//     setLoadingMoreUsers(true);
    
//     // Simulate loading delay
//     setTimeout(() => {
//       setVisibleUsersCount(prev => prev + 3); // Load 3 more users
//       setLoadingMoreUsers(false);
//     }, 500);
//   };



//   return (
//     <div className="p-1 md:p-3 grid grid-cols-8 gap-6">
//       <div className="col-span-6 flex flex-col lg:flex-row gap-2">
//         <div className="flex-1">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
//             {loading.summary ? (
//               <div className="col-span-3 flex justify-center p-2">
//               </div>
//             ) : error.summary ? (
//               <div className="col-span-3 flex items-center justify-center p-2 bg-red-50 rounded-full text-red-600">
//                 {error.summary}
//               </div>
//             ) : (
//             summaryData.map((item, index) => (
//                 <div 
//                   key={index} 
//                   className={`${item.className} p-2 rounded-lg`}
//                 >
//                   <div className="flex items-center mb-1">
//                     {item.icon}
//                     <h3 className="text-sm font-medium text-custom-sidebar ml-1">{item.label}</h3>
//                   </div>
//                   <p className="text-lg font-semibold text-custom-sidebar">{item.count}</p>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Search Bar */}
//           <div className="mb-4 justify-end flex">
//             <div className="relative w-full max-w-sm">
//               <input
//                 type="text"
//                 placeholder="Search Projects..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full p-1.5 pl-8 text-sm bg-white rounded-lg  "
//               />
//               <Search className="absolute left-2 top-2 text-gray-400" size={16} />
//             </div>
//           </div>

//           {/* Recent Projects Table */}
//           <div className="bg-white p-3 rounded-lg shadow-sm ">
//             <h2 className="text-base font-medium mb-2">Recent Projects</h2>
//             <div>
//               {loading.activities ? (
//                 <div className="flex justify-center p-2">
//                 </div>
//               ) : error.activities ? (
//                 <div className="flex items-center justify-center p-2 bg-red-50 rounded text-red-600">
//                   {error.activities}
//                 </div>
//               ) : (
//                 <table className="w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Project ID
//                       </th>
//                       <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Project Name
//                       </th>
//                       <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                         Description
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredProjects.length > 0 ? (
//                       filteredProjects.map((project, index) => (
//                         <tr 
//                           key={project.id} 
//                           className="bg-white hover:bg-blue-50 transition-colors duration-150"
//                           onClick={() => handleRowClick(project.id)}
//                         >
//                           <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
//                             {project.project_id}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 font-medium">
//                             {project.project_name}
//                           </td>
//                           <td className="px-2 py-2 text-xs text-gray-500">
//                             <div className="max-w-xs">
//                               {project.project_description}
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3" className="text-center text-gray-500 py-2">
//                           {searchQuery ? (
//                             <div className="flex flex-col items-center py-1">
//                               <Search size={16} className="text-gray-400 mb-1" />
//                               <p className="text-xs">No projects found matching "{searchQuery}"</p>
//                             </div>
//                           ) : (
//                             <p className="text-xs">No recent projects found.</p>
//                           )}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="col-span-2 rounded-lg p-4  bg-slate-200    ">
//       <div className="p-4 bg-mainsection rounded-lg ">
//      <UserAnalysisChart/>
//       </div>
//       <div className="p-4 bg-white rounded-lg mt-2">
//           <div className="flex justify-between items-center mb-3">
//             <p className="text-sm font-semibold">Recommended Users</p>
//           </div>
          
//           {usersLoading ? (
//             <div className="flex justify-center items-center h-24">
//               <p className="text-xs text-gray-500">Loading users...</p>
//             </div>
//           ) : currentUsers.length > 0 ? (
//             <>
//               <div className="space-y-3">
//                 {currentUsers.map((user) => (
//                   <div 
//                     key={user.id} 
//                     className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
//                     onClick={() => handleUserClick(user.id)}
//                   >
//                     {user.profile_picture ? (
//                       <img 
//                         src={user.profile_picture} 
//                         alt={user.name || "User"} 
//                         className="w-8 h-8 rounded-full object-cover mr-2"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
//                         <User size={14} className="text-gray-500" />
//                       </div>
//                     )}
//                     <div>
//                       <p className="text-xs font-medium">{user.name || user.username || "User"}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {/* View More Users Button */}
//               {users.length > visibleUsersCount && (
//                 <div className="mt-4 text-center">
//                   <button
//                     onClick={handleLoadMoreUsers}
//                     disabled={loadingMoreUsers}
//                     className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     {loadingMoreUsers ? "Loading..." : "View More Users"}
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-24">
//               <User size={16} className="text-gray-400 mb-1" />
//               <p className="text-xs text-gray-500">No users found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainSection;





import React, { useEffect, useState } from "react";
import { Search, BarChart2, User, ChevronLeft, ChevronRight, Clipboard, Clock, CheckCircle } from "lucide-react";
import { RecentActivityAdmin, SummaryCardsByAdmin } from "../../../api/projectApi";
import { useNavigate } from "react-router-dom";
import UserAnalysisChart from '../../admin/pages/UserAnalysisChart'
import { fetchUserMainsection } from "../../../api/userApi";
import { API_URL } from "../../../utils/constants";


const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const navigate = useNavigate()
  const [loading, setLoading] = useState({
    summary: true,
    activities: true,
    users: true
  });


  const [visibleUsersCount, setVisibleUsersCount] = useState(4);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);
  
  const [error, setError] = useState({
    summary: null,
    activities: null,
    users: null
  });

  
  // Fetch data on component mount
  useEffect(() => {
    fetchSummaryData();
    fetchRecentActivities();
    fetchRecommendedUsers();
  }, []);

  useEffect(() => {
    console.log("recntproject", recentProjects);
  }, [recentProjects]);

  // Fetch recommended users using the provided API
  const fetchRecommendedUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const data = await fetchUserMainsection();
      setRecommendedUsers(data);
      console.log("Recommended users data:", data);
      setError(prev => ({ ...prev, users: null }));
    } catch (err) {
      console.error("Error fetching recommended users:", err);
      setError(prev => ({ ...prev, users: "Failed to load recommended users" }));
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Fetch summary cards data
  const fetchSummaryData = async () => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const data = await SummaryCardsByAdmin();
      
      // Format the data for project tab based on backend response
      const projectData = [
        { 
          label: "Total Projects", 
          count: data.total_projects, 
          className: "bg-[#D0D4FF]",
          icon: <Clipboard className="text-blue-700" size={18}   strokeWidth={3}/>
        },
        { 
          label: "Pending Projects", 
          count: data.pending_projects, 
          className: "bg-[#D0D4FF]",
          icon: <Clock className="text-red-800 " size={18} strokeWidth={3}/>
        },
        { 
          label: "Completed Projects", 
          count: data.completed_projects, 
          className: "bg-[#D0D4FF]",
          icon: <CheckCircle className="text-green-600 " size={18} strokeWidth={3} />
        },
      ];

      setSummaryData(projectData);
      setError(prev => ({ ...prev, summary: null }));
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError(prev => ({ ...prev, summary: "Failed to load summary data" }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Fetch recent activities data
  const fetchRecentActivities = async () => {
    try {
      setLoading(prev => ({ ...prev, activities: true }));
      const data = await RecentActivityAdmin();
      setRecentProjects(data);
      setError(prev => ({ ...prev, activities: null }));
    } catch (err) {
      console.error("Error fetching recent activities:", err);
      setError(prev => ({ ...prev, activities: "Failed to load recent activities" }));
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  const handleRowClick = (projectId) => {
    navigate(`/admin_dashboard/project_details/${projectId}`);
  };

  const handleUserClick = (userId) => {
    navigate(`/admin_dashboard/view_user_details/${userId}`);
  };

  // Filter projects based on search query
  const filteredProjects = recentProjects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUsers = recommendedUsers && recommendedUsers.length > 0 ? 
    recommendedUsers.slice(0, visibleUsersCount) : [];
  
  // Handle loading more users
  const handleLoadMoreUsers = () => {
    setLoadingMoreUsers(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setVisibleUsersCount(prev => prev + 3); // Load 3 more users
      setLoadingMoreUsers(false);
    }, 500);
  };



  return (
    <div className="p-1 md:p-3 grid grid-cols-8 gap-6">
      <div className="col-span-6 flex flex-col lg:flex-row gap-2">
        <div className="flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            {loading.summary ? (
              <div className="col-span-3 flex justify-center p-2">
              </div>
            ) : error.summary ? (
              <div className="col-span-3 flex items-center justify-center p-2 bg-red-50 rounded-full text-red-600">
                {error.summary}
              </div>
            ) : (
            summaryData.map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.className} p-2 rounded-lg`}
                >
                  <div className="flex items-center mb-1">
                    {item.icon}
                    <h3 className="text-sm font-medium text-custom-sidebar ml-1">{item.label}</h3>
                  </div>
                  <p className="text-lg font-semibold text-custom-sidebar">{item.count}</p>
                </div>
              ))
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-4 justify-end flex">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search Projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-1.5 pl-8 text-sm bg-white rounded-lg  "
              />
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Recent Projects Table */}
          <div className="bg-white p-3 rounded-lg shadow-sm ">
            <h2 className="text-base font-medium mb-2">Recent Projects</h2>
            <div>
              {loading.activities ? (
                <div className="flex justify-center p-2">
                </div>
              ) : error.activities ? (
                <div className="flex items-center justify-center p-2 bg-red-50 rounded text-red-600">
                  {error.activities}
                </div>
              ) : (
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Project ID
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Project Name
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project, index) => (
                        <tr 
                          key={project.id} 
                          className="bg-white hover:bg-blue-50 transition-colors duration-150"
                          onClick={() => handleRowClick(project.id)}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                            {project.project_id}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 font-medium">
                            {project.project_name}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500">
                            <div className="max-w-xs">
                              {project.project_description}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-2">
                          {searchQuery ? (
                            <div className="flex flex-col items-center py-1">
                              <Search size={16} className="text-gray-400 mb-1" />
                              <p className="text-xs">No projects found matching "{searchQuery}"</p>
                            </div>
                          ) : (
                            <p className="text-xs">No recent projects found.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 rounded-lg p-4  bg-slate-200    ">
      <div className="p-4 bg-mainsection rounded-lg ">
     <UserAnalysisChart/>
      </div>
      <div className="p-4 bg-white rounded-lg mt-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold">Recommended Users</p>
          </div>
          
          {loading.users ? (
            <div className="flex justify-center items-center h-24">
              <p className="text-xs text-gray-500">Loading users...</p>
            </div>
          ) : error.users ? (
            <div className="flex items-center justify-center p-2 bg-red-50 rounded text-red-600 text-xs">
              {error.users}
            </div>
          ) : currentUsers.length > 0 ? (
            <>
              <div className="space-y-3">
                {currentUsers.map((user, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleUserClick(user.id || index)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <img
  src={user?.profile_picture ? `${API_URL}${user.profile_picture}` : "/default.svg"}
  alt="Profile"
  className="w-8 h-8 rounded-full object-cover"
/>
                   </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{user.name || "User"}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.experience_month} {user.experience_month === 1 ? "month" : "months"}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View More Users Button */}
              {recommendedUsers.length > visibleUsersCount && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleLoadMoreUsers}
                    disabled={loadingMoreUsers}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {loadingMoreUsers ? "Loading..." : "View More Users"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-24">
              <User size={16} className="text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;