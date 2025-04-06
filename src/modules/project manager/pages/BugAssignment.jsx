
// import React, { useEffect, useState } from 'react';
// import { fetchFailedBugProjects, fetchFailedBugModules } from '../../../api/projectApi';
// import { BugByModule } from '../../../api/bugApi';
// import { Filter, Plus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';


// const BugAssignment = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [modules, setModules] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [bugData, setBugData] = useState([]);
//   const [filteredBugData, setFilteredBugData] = useState([]);
//   const [severityFilter, setSeverityFilter] = useState('all');
//   const [showSeverityFilter, setShowSeverityFilter] = useState(false);
//   const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
//   const [selectedBug, setSelectedBug] = useState(null);


//   useEffect(() => {
//     const getProjects = async () => {
//       try {
//         const response = await fetchFailedBugProjects();
//         setProjects(response);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       }
//     };
//     getProjects();
//   }, []);
  
//   useEffect(() => {
//     if (selectedProject) {
//       const getModules = async () => {
//         try {
//           const response = await fetchFailedBugModules(selectedProject);
//           setModules(response);
//         } catch (error) {
//           console.error("Error fetching modules:", error);
//         }
//       };
//       getModules();
//     } else {
//       setModules([]);
//     }
//   }, [selectedProject]);
  
//   useEffect(() => {
//     if (selectedModule) {
//       const getBugData = async () => {
//         try {
//           const response = await BugByModule(selectedModule);
//           setBugData(response);
//           setFilteredBugData(response);
//           console.log("Bug data:", response);
//         } catch (error) {
//           console.error("Error fetching bug data:", error);
//         }
//       };
//       getBugData();
//     } else {
//       setBugData([]);
//       setFilteredBugData([]);
//     }
//   }, [selectedModule]);

//   // Apply severity filter when it changes
//   useEffect(() => {
//     if (severityFilter === 'all') {
//       setFilteredBugData(bugData);
//     } else {
//       const filtered = bugData.filter(bug => 
//         bug.severity?.toLowerCase() === severityFilter.toLowerCase()
//       );
//       setFilteredBugData(filtered);
//     }
//   }, [severityFilter, bugData]);

//   const handleProjectChange = (e) => {
//     setSelectedProject(e.target.value);
//     setSelectedModule(null);
//   };

//   const handleAddTaskClick = (bug) => {
//     setSelectedBug(bug);
//     setShowAddTaskPopup(true);
//   };
//   const handleClosePopup = () => {
//   setShowAddTaskPopup(false);
//   setSelectedBug(null);
// };

// const handleTaskAdded = () => {
//   // Refresh data if needed
//   if (selectedModule) {
//     const getBugData = async () => {
//       try {
//         const response = await BugByModule(selectedModule);
//         setBugData(response);
//         setFilteredBugData(response);
//       } catch (error) {
//         console.error("Error fetching bug data:", error);
//       }
//     };
//     getBugData();
//   }
// };
  
//   const handleModuleChange = (e) => {
//     setSelectedModule(e.target.value);
//   };

//   const getSeverityClass = (severity) => {
//     switch (severity?.toLowerCase()) {
//       case 'critical':
//         return 'bg-red-100 text-red-800';
//       case 'major':
//         return 'bg-orange-100 text-orange-800';
//       case 'minor':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

 
//   const toggleSeverityFilter = () => {
//     setShowSeverityFilter(!showSeverityFilter);
//   };

//   const handleSeverityFilterChange = (severity) => {
//     setSeverityFilter(severity);
//     setShowSeverityFilter(false);
//   };

//   const handleRowClick = (bug) => {
//     // Make sure we're passing the projectId as a query parameter
//     navigate(`/projectmanager_dashboard/bug_detail/${bug.id}?projectId=${selectedProject}`);
//   }

//   return (
//     <div className="p-2">
//       <div className="flex gap-2 mb-2">
//         <select
//           className="bg-white text-sm text-black rounded-lg p-2"
//           onChange={handleProjectChange}
//           value={selectedProject || ''}
//         >
//           <option value="">--Select Project--</option>
//           {projects.map((project) => (
//             <option key={project.id} value={project.id}>
//               {project.project_name}
//             </option>
//           ))}
//         </select>
        
//         <select
//           name="select module"
//           className="bg-white text-sm text-black rounded-lg p-2"
//           onChange={handleModuleChange}
//           value={selectedModule || ''}
//           disabled={!selectedProject}
//         >
//           <option value="">--Select Module--</option>
//           {modules.map((module) => (
//             <option key={module.id} value={module.id}>
//               {module.module_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="bg-slate-200 border border-dashed border-gray-300 rounded-lg">
//         <div className="flex justify-end items-center gap-1 p-2">
          
          
//           <div className="relative ">
//             <button 
//               className="flex items-center  gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
//               onClick={toggleSeverityFilter}
//             >
//               <span>Filter By Severity</span>
//               <Filter size={14} />
//             </button>
            
//             {showSeverityFilter && (
//               <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
//                 <ul className="py-1">
//                   <li 
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => handleSeverityFilterChange('all')}
//                   >
//                     All Severities
//                   </li>
//                   <li 
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => handleSeverityFilterChange('critical')}
//                   >
//                     Critical
//                   </li>
//                   <li 
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => handleSeverityFilterChange('major')}
//                   >
//                     Major
//                   </li>
//                   <li 
//                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => handleSeverityFilterChange('minor')}
//                   >
//                     Minor
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>

//         <hr className="border-dashed border-gray-300 mt-2 mx-auto" />

//         <div className="p-3">
//           {filteredBugData.length > 0 ? (
//             <div className="overflow-x-auto bg-white rounded-lg">
//               <table className="w-full border border-gray-100 text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-2 text-left font-medium">Bug ID</th>
//                     <th className="p-2 text-left font-medium">Bug Name</th>
//                     <th className="p-2 text-left font-medium">Status</th>
//                     <th className="p-2 text-left font-medium">Severity</th>
//                     <th className="p-2 text-left font-medium">Reported By</th>
//                     <th className="p-2 text-left font-medium">TestCase</th>
//                     <th className="p-2 text-left font-medium">Assigned to</th>
//                     <th className="p-2 text-left font-medium">Fix task</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredBugData.map((bug) => (
//                     <tr key={bug.id} className="border-t border-gray-100 hover:bg-gray-50" onClick={() => handleRowClick(bug)}>
//                       <td className="p-2">{bug.bug_id}</td>
//                       <td className="p-2 max-w-xs truncate" title={bug.title}>{bug.title}</td>
//                       <td className="p-2">
//                         <span className={`px-1.5 py-0.5 rounded-full text-xs ${
//                           bug.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                         }`}>
//                           {bug.status}
//                         </span>
//                       </td>
//                       <td className="p-2">
//                         <span className={`px-1.5 py-0.5 rounded-full text-xs ${getSeverityClass(bug.severity)}`}>
//                           {bug.severity}
//                         </span>
//                       </td>
//                       <td className="p-2 truncate">{bug.reported_by?.full_name || 'N/A'}</td>
//                       <td className="p-2">
//                         {bug.test_case_result?.result && (
//                           <span className={`px-1.5 py-0.5 rounded-full text-xs ${
//                             bug.test_case_result.result === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                           }`}>
//                             {bug.test_case_result.result}
//                           </span>
//                         )}
//                       </td>
//                       <td className="p-2 truncate">{bug.assigned_to?.user_details?.name || 'Not Assigned'}</td>
//                       <td className="p-2">
//                         <span className={`px-1.5 py-0.5 rounded-full text-xs ${
//                           bug.fix_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                           bug.fix_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {bug.fix_status || 'N/A'}
//                         </span>
//                       </td>
                     
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : selectedModule ? (
//             <div className="text-center py-4 text-xs">
//               <p className="text-gray-500">No bug data available</p>
//             </div>
//           ) : (
//             <div className="text-center py-4 text-xs">
//               <p className="text-gray-500">Please select a project and module</p>
//             </div>
//           )}
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default BugAssignment;




import React, { useEffect, useState } from 'react';
import { fetchFailedBugProjects, fetchFailedBugModules } from '../../../api/projectApi';
import { BugByModule } from '../../../api/bugApi';
import { Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const BugAssignment = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [bugData, setBugData] = useState([]);
  const [filteredBugData, setFilteredBugData] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showSeverityFilter, setShowSeverityFilter] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);


  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetchFailedBugProjects();
        setProjects(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    getProjects();
  }, []);
  
  useEffect(() => {
    if (selectedProject) {
      const getModules = async () => {
        try {
          const response = await fetchFailedBugModules(selectedProject);
          setModules(response);
        } catch (error) {
          console.error("Error fetching modules:", error);
        }
      };
      getModules();
    } else {
      setModules([]);
    }
  }, [selectedProject]);
  
  useEffect(() => {
    if (selectedModule) {
      const getBugData = async () => {
        try {
          const response = await BugByModule(selectedModule);
          setBugData(response);
          setFilteredBugData(response);
          console.log("Bug data:", response);
        } catch (error) {
          console.error("Error fetching bug data:", error);
        }
      };
      getBugData();
    } else {
      setBugData([]);
      setFilteredBugData([]);
    }
  }, [selectedModule]);

  // Apply severity filter when it changes
  useEffect(() => {
    if (severityFilter === 'all') {
      setFilteredBugData(bugData);
    } else {
      const filtered = bugData.filter(bug => 
        bug.severity?.toLowerCase() === severityFilter.toLowerCase()
      );
      setFilteredBugData(filtered);
    }
  }, [severityFilter, bugData]);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setSelectedModule(null);
  };

  const handleAddTaskClick = (bug) => {
    setSelectedBug(bug);
    setShowAddTaskPopup(true);
  };
  
  const handleClosePopup = () => {
    setShowAddTaskPopup(false);
    setSelectedBug(null);
  };

  const handleTaskAdded = () => {
    // Refresh data if needed
    if (selectedModule) {
      const getBugData = async () => {
        try {
          const response = await BugByModule(selectedModule);
          setBugData(response);
          setFilteredBugData(response);
        } catch (error) {
          console.error("Error fetching bug data:", error);
        }
      };
      getBugData();
    }
  };
  
  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

 
  const toggleSeverityFilter = () => {
    setShowSeverityFilter(!showSeverityFilter);
  };

  const handleSeverityFilterChange = (severity) => {
    setSeverityFilter(severity);
    setShowSeverityFilter(false);
  };

  const handleRowClick = (bug) => {
    // Ensure we're passing the projectId as a query parameter using the format expected by the backend
    navigate(`/projectmanager_dashboard/bug_detail/${bug.id}?projectId=${selectedProject}`);
  }
  
  return (
    <div className="p-2">
      <div className="flex gap-2 mb-2">
        <select
          className="bg-white text-sm text-black rounded-lg p-2"
          onChange={handleProjectChange}
          value={selectedProject || ''}
        >
          <option value="">--Select Project--</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.project_name}
            </option>
          ))}
        </select>
        
        <select
          name="select module"
          className="bg-white text-sm text-black rounded-lg p-2"
          onChange={handleModuleChange}
          value={selectedModule || ''}
          disabled={!selectedProject}
        >
          <option value="">--Select Module--</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.module_name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-200 border border-dashed border-gray-300 rounded-lg">
        <div className="flex justify-end items-center gap-1 p-2">
          
          <div className="relative">
            <button 
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              onClick={toggleSeverityFilter}
            >
              <span>Filter By Severity</span>
              <Filter size={14} />
            </button>
            
            {showSeverityFilter && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
                <ul className="py-1">
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSeverityFilterChange('all')}
                  >
                    All Severities
                  </li>
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSeverityFilterChange('critical')}
                  >
                    Critical
                  </li>
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSeverityFilterChange('major')}
                  >
                    Major
                  </li>
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSeverityFilterChange('minor')}
                  >
                    Minor
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <hr className="border-dashed border-gray-300 mt-2 mx-auto" />

        <div className="p-3">
          {filteredBugData.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg">
              <table className="w-full border border-gray-100 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left font-medium">Bug ID</th>
                    <th className="p-2 text-left font-medium">Bug Name</th>
                    <th className="p-2 text-left font-medium">Status</th>
                    <th className="p-2 text-left font-medium">Severity</th>
                    <th className="p-2 text-left font-medium">Reported By</th>
                    <th className="p-2 text-left font-medium">TestCase</th>
                    <th className="p-2 text-left font-medium">Assigned to</th>
                    <th className="p-2 text-left font-medium">Fix task</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBugData.map((bug) => (
                    <tr key={bug.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(bug)}>
                      <td className="p-2">{bug.bug_id}</td>
                      <td className="p-2 max-w-xs truncate" title={bug.title}>{bug.title}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                          bug.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {bug.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${getSeverityClass(bug.severity)}`}>
                          {bug.severity}
                        </span>
                      </td>
                      <td className="p-2 truncate">{bug.reported_by?.full_name || 'N/A'}</td>
                      <td className="p-2">
                        {bug.test_case_result?.result && (
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            bug.test_case_result.result === 'failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {bug.test_case_result.result}
                          </span>
                        )}
                      </td>
                      <td className="p-2 truncate">{bug.assigned_to?.user_details?.name || 'Not Assigned'}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                          bug.fix_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          bug.fix_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bug.fix_status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedModule ? (
            <div className="text-center py-4 text-xs">
              <p className="text-gray-500">No bug data available</p>
            </div>
          ) : (
            <div className="text-center py-4 text-xs">
              <p className="text-gray-500">Please select a project and module</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugAssignment;