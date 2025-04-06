



// import React, { useState, useEffect } from 'react';
// import { DetailedBug } from '../../../api/bugApi';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, FileText, PaperclipIcon, Plus } from 'lucide-react';
// import AddTaskPopup from './AddTaskPopup';

// const BugDetails = () => {
//   const { bugId } = useParams();
//   const navigate = useNavigate();
//   const [bugDetails, setBugDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
//   const [selectedBug, setSelectedBug] = useState(null);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [projectId, setProjectId] = useState(null);

//   useEffect(() => {
//     const fetchBugDetails = async () => {
//       try {
//         // First get project ID from URL query parameters
//         const urlParams = new URLSearchParams(window.location.search);
//         const urlProjectId = urlParams.get('projectId');
        
//         // Log to debug
//         console.log("URL Project ID:", urlProjectId);
        
//         if (urlProjectId) {
//           const parsedId = parseInt(urlProjectId, 10);
//           console.log("Using project ID from URL params:", parsedId);
//           setProjectId(parsedId);
//         }
        
//         // Fetch bug details from API
//         const data = await DetailedBug(bugId);
//         console.log("Bug details response:", data);
//         setBugDetails(data);
        
//         // Only look for project ID in response if we didn't get it from URL
//         if (!urlProjectId) {
//           // Try to extract project ID from various possible locations in the response
//           let projectIdFound = null;
          
//           // Check bug.project.id first (preferred path)
//           if (data && data.project && data.project.id) {
//             projectIdFound = data.project.id;
//           } 
//           // Check bug.project_id
//           else if (data && data.project_id) {
//             projectIdFound = data.project_id;
//           } 
//           // Check bug.module.project paths
//           else if (data && data.module) {
//             if (data.module.project_id) {
//               projectIdFound = data.module.project_id;
//             } else if (data.module.project && data.module.project.id) {
//               projectIdFound = data.module.project.id;
//             }
//           }
//           // Check test case result path as last resort
//           else if (data && data.test_case_result && data.test_case_result.project_id) {
//             projectIdFound = data.test_case_result.project_id;
//           }
//           // Check bug.id as absolute fallback
//           else if (data && data.id) {
//             console.log("Using bug ID as fallback:", data.id);
//             projectIdFound = 1; // Default to 1 if no project ID found
//           }
          
//           // Set project ID if found in response
//           if (projectIdFound) {
//             console.log("Found project ID in response:", projectIdFound);
//             setProjectId(projectIdFound);
//           } else {
//             console.warn("Could not find project ID in bug details:", data);
//             // Fallback to a default project ID
//             setProjectId(1);
//           }
//         }
        
//         // Set module ID if available
//         if (data && data.module && data.module.id) {
//           const moduleId = data.module.id;
//           setSelectedModule(moduleId);
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching bug details:", err);
//         setError(err.message || "Failed to load bug details");
//         setLoading(false);
//       }
//     };
    
//     fetchBugDetails();
//   }, [bugId]);

//   const getSeverityBadge = (severity) => {
//     switch (severity?.toLowerCase()) {
//       case 'critical':
//         return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Critical</span>;
//       case 'major':
//         return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Major</span>;
//       case 'minor':
//         return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Minor</span>;
//       default:
//         return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{severity || 'Unknown'}</span>;
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'open':
//       case 'to_do':
//         return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{status}</span>;
//       case 'in_progress':
//         return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">{status}</span>;
//       case 'resolved':
//       case 'completed':
//         return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{status}</span>;
//       case 'failed':
//         return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">{status}</span>;
//       default:
//         return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status || 'Unknown'}</span>;
//     }
//   };

//   const getFixStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
//       case 'completed':
//         return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>;
//       default:
//         return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status || 'N/A'}</span>;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   const handleClosePopup = () => {
//     setShowAddTaskPopup(false);
//     setSelectedBug(null);
//   };
  
//   const handleAddTaskClick = () => {
//     if (!projectId) {
//       console.error("Cannot add task: Project ID is missing");
//       // Show an error message to the user
//       alert("Unable to add task: Project information is missing. Please contact your system administrator.");
//       return;
//     }
//     setSelectedBug(bugDetails);
//     setShowAddTaskPopup(true);
//   };

//   const handleTaskAdded = () => {
//     // Refresh data after task is added
//     const fetchBugDetails = async () => {
//       try {
//         const data = await DetailedBug(bugId);
//         setBugDetails(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
//     fetchBugDetails();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8">
//         <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-4">
//           <p className="font-medium">Error loading bug details</p>
//           <p>{error}</p>
//         </div>
//         <button 
//           onClick={handleBackClick}
//           className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//         >
//           <ArrowLeft size={16} />
//           Back to Bug List
//         </button>
//       </div>
//     );
//   }

//   if (!bugDetails) {
//     return (
//       <div className="flex flex-col items-center justify-center p-8">
//         <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 mb-4">
//           <p>No bug details available.</p>
//         </div>
//         <button 
//           onClick={handleBackClick}
//           className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//         >
//           <ArrowLeft size={16} />
//           Back to Bug List
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       {/* Header */}
//       <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <button 
//             onClick={handleBackClick} 
//             className="p-1 rounded hover:bg-gray-200"
//           >
//             <ArrowLeft size={16} />
//           </button>
//           <h1 className="text-lg font-medium">{bugDetails.bug_id}: {bugDetails.title}</h1>
//         </div>
//         <div className="flex items-center gap-3">
//           {getSeverityBadge(bugDetails.severity)}
//           {getStatusBadge(bugDetails.status)}
//           {getFixStatusBadge(bugDetails.fix_status)}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left column - Main bug details */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="space-y-4">
//             <h2 className="text-md font-semibold">Description</h2>
//             <p className="text-sm text-gray-700 whitespace-pre-line">{bugDetails.description}</p>
//           </div>

//           <div className="space-y-4">
//             <h2 className="text-md font-semibold">Steps to Reproduce</h2>
//             <p className="text-sm text-gray-700 whitespace-pre-line">{bugDetails.steps_to_reproduce}</p>
//           </div>

//           {bugDetails.test_case_result && (
//             <div className="space-y-4">
//               <h2 className="text-md font-semibold">Test Case Results</h2>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-sm">Result:</span>
//                   {getStatusBadge(bugDetails.test_case_result.result)}
//                 </div>
//                 <div className="flex items-start gap-2">
//                   <span className="font-medium text-sm">Remarks:</span>
//                   <p className="text-sm text-gray-700">{bugDetails.test_case_result.remarks}</p>
//                 </div>
//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="font-medium text-sm">Execution Date:</span>
//                   <p className="text-sm text-gray-700">{formatDate(bugDetails.test_case_result.execution_date)}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {bugDetails.attachments && bugDetails.attachments.length > 0 && (
//             <div className="space-y-4">
//               <h2 className="text-md font-semibold">Attachments</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {bugDetails.attachments.map(attachment => (
//                   <a 
//                     key={attachment.id}
//                     href={attachment.file}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
//                   >
//                     <PaperclipIcon size={16} className="text-gray-500" />
//                     <span className="text-sm text-blue-600 truncate">
//                       {attachment.file.split('/').pop()}
//                     </span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="mt-4">
//             <button 
//               className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
//               onClick={handleAddTaskClick}
//             >
//               <Plus size={16} />
//               Add Task
//             </button>
//           </div>

//           {bugDetails.fix_task && (
//             <div className="space-y-4 border-t pt-6">
//               <h2 className="text-md font-semibold">Fix Task</h2>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-4">
//                   <div>
//                     <span className="text-xs text-gray-500">Task ID</span>
//                     <p className="text-sm font-medium">{bugDetails.fix_task.task_id}</p>
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500">Status</span>
//                     <div>{getStatusBadge(bugDetails.fix_task.status)}</div>
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500">Priority</span>
//                     <p className="text-sm font-medium capitalize">{bugDetails.fix_task.priority}</p>
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500">Due Date</span>
//                     <p className="text-sm font-medium">{bugDetails.fix_task.due_date}</p>
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <span className="text-xs text-gray-500">Task Name</span>
//                   <p className="text-sm font-medium">{bugDetails.fix_task.task_name}</p>
//                 </div>
//                 <div className="mb-4">
//                   <span className="text-xs text-gray-500">Description</span>
//                   <p className="text-sm text-gray-700 mt-1">{bugDetails.fix_task.task_description}</p>
//                 </div>
//                 {bugDetails.fix_task.document && (
//                   <div className="mb-4">
//                     <span className="text-xs text-gray-500">Document</span>
//                     <div className="mt-1">
//                       <a 
//                         href={bugDetails.fix_task.document}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
//                       >
//                         <FileText size={14} />
//                         View Document
//                       </a>
//                     </div>
//                   </div>
//                 )}
//                 {bugDetails.fix_task.comments && bugDetails.fix_task.comments.length > 0 && (
//                   <div>
//                     <span className="text-xs text-gray-500">Comments</span>
//                     <div className="mt-2 space-y-3">
//                       {bugDetails.fix_task.comments.map(comment => (
//                         <div key={comment.id} className="bg-white p-3 rounded border border-gray-200">
//                           <div className="flex justify-between items-center mb-1">
//                             <span className="text-sm font-medium">{comment.user_name}</span>
//                             <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
//                           </div>
//                           <p className="text-sm">{comment.content}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right column - Meta information */}
//         <div className="space-y-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium mb-3">Bug Information</h3>
            
//             <div className="space-y-3">
//               <div>
//                 <span className="text-xs text-gray-500 block">Created</span>
//                 <span className="text-sm">{formatDate(bugDetails.created_at)}</span>
//               </div>
              
//               <div>
//                 <span className="text-xs text-gray-500 block">Environment</span>
//                 <span className="text-sm">{bugDetails.environment || 'Not specified'}</span>
//               </div>
              
//               <div>
//                 <span className="text-xs text-gray-500 block">Priority</span>
//                 <span className="text-sm font-medium">{bugDetails.priority}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium mb-3">People</h3>
            
//             <div className="space-y-4">
//               {bugDetails.reported_by && (
//                 <div>
//                   <span className="text-xs text-gray-500 block">Reported By</span>
//                   <span className="text-sm font-medium">{bugDetails.reported_by.full_name}</span>
//                 </div>
//               )}
              
//               {bugDetails.assigned_to && bugDetails.assigned_to.user_details && (
//                 <div>
//                   <span className="text-xs text-gray-500 block">Assigned To</span>
//                   <div className="flex items-center gap-2">
//                     {bugDetails.assigned_to.user_details.profile_picture && (
//                       <img 
//                         src={bugDetails.assigned_to.user_details.profile_picture} 
//                         alt={bugDetails.assigned_to.user_details.name}
//                         className="w-6 h-6 rounded-full object-cover"
//                       />
//                     )}
//                     <span className="text-sm font-medium">{bugDetails.assigned_to.user_details.name}</span>
//                   </div>
//                   <div className="mt-1">
//                     <span className="text-xs text-gray-500">{bugDetails.assigned_to.user_details.email}</span>
//                   </div>
//                   <div className="mt-1">
//                     <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
//                       {bugDetails.assigned_to.user_details.role}
//                     </span>
//                     {bugDetails.assigned_to.user_details.specialization && (
//                       <span className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded ml-1">
//                         {bugDetails.assigned_to.user_details.specialization}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Task Popup */}
//       {showAddTaskPopup && selectedBug && projectId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="w-full max-w-2xl">
//             <AddTaskPopup
//               bugId={selectedBug.id}
//               moduleId={selectedModule}
//               projectId={projectId}
//               onClose={handleClosePopup}
//               onTaskAdded={handleTaskAdded}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BugDetails;




import React, { useState, useEffect } from 'react';
import { DetailedBug } from '../../../api/bugApi';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, FileText, PaperclipIcon, Plus } from 'lucide-react';
import AddTaskPopup from './AddTaskPopup';

const BugDetails = () => {
  const { bugId } = useParams();
  const navigate = useNavigate();
  const [bugDetails, setBugDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        // First get project ID from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlProjectId = urlParams.get('projectId');
        
        // Log to debug
        console.log("URL Project ID:", urlProjectId);
        
        if (urlProjectId) {
          const parsedId = parseInt(urlProjectId, 10);
          console.log("Using project ID from URL params:", parsedId);
          setProjectId(parsedId);
        }
        
        // Fetch bug details from API
        const data = await DetailedBug(bugId);
        console.log("Bug details response:", data);
        setBugDetails(data);
        
        // Only look for project ID in response if we didn't get it from URL
        if (!urlProjectId) {
          // Try to extract project ID from various possible locations in the response
          let projectIdFound = null;
          
          // Check bug.project.id first (preferred path)
          if (data && data.project && data.project.id) {
            projectIdFound = data.project.id;
          } 
          // Check bug.project_id
          else if (data && data.project_id) {
            projectIdFound = data.project_id;
          } 
          // Check bug.module.project paths
          else if (data && data.module) {
            if (data.module.project_id) {
              projectIdFound = data.module.project_id;
            } else if (data.module.project && data.module.project.id) {
              projectIdFound = data.module.project.id;
            }
          }
          // Check test case result path as last resort
          else if (data && data.test_case_result && data.test_case_result.project_id) {
            projectIdFound = data.test_case_result.project_id;
          }
          // Check bug.id as absolute fallback
          else if (data && data.id) {
            console.log("Using bug ID as fallback:", data.id);
            projectIdFound = 1; // Default to 1 if no project ID found
          }
          
          // Set project ID if found in response
          if (projectIdFound) {
            console.log("Found project ID in response:", projectIdFound);
            setProjectId(projectIdFound);
          } else {
            console.warn("Could not find project ID in bug details:", data);
            // Fallback to a default project ID
            setProjectId(1);
          }
        }
        
        // Set module ID if available
        if (data && data.module && data.module.id) {
          const moduleId = data.module.id;
          setSelectedModule(moduleId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bug details:", err);
        setError(err.message || "Failed to load bug details");
        setLoading(false);
      }
    };
    
    fetchBugDetails();
  }, [bugId]);

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Critical</span>;
      case 'major':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Major</span>;
      case 'minor':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Minor</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{severity || 'Unknown'}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'to_do':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{status}</span>;
      case 'in_progress':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">{status}</span>;
      case 'resolved':
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{status}</span>;
      case 'failed':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">{status}</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status || 'Unknown'}</span>;
    }
  };

  const getFixStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status || 'N/A'}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleClosePopup = () => {
    setShowAddTaskPopup(false);
    setSelectedBug(null);
  };
  
  const handleAddTaskClick = () => {
    if (!projectId) {
      console.error("Cannot add task: Project ID is missing");
      // Show an error message to the user
      alert("Unable to add task: Project information is missing. Please contact your system administrator.");
      return;
    }
    setSelectedBug(bugDetails);
    setShowAddTaskPopup(true);
  };

  const handleTaskAdded = (newTask) => {
    // Update bugDetails with the newly added task without refreshing
    setBugDetails({
      ...bugDetails,
      fix_task: newTask
    });
    
    // Close the popup
    handleClosePopup();
  };

  // Check if there's already a task associated with this bug
  const hasExistingTask = bugDetails && bugDetails.fix_task;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-4">
          <p className="font-medium">Error loading bug details</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={handleBackClick}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Bug List
        </button>
      </div>
    );
  }

  if (!bugDetails) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 mb-4">
          <p>No bug details available.</p>
        </div>
        <button 
          onClick={handleBackClick}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Bug List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBackClick} 
            className="p-1 rounded hover:bg-gray-200"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-medium">{bugDetails.bug_id}: {bugDetails.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {getSeverityBadge(bugDetails.severity)}
          {getStatusBadge(bugDetails.status)}
          {getFixStatusBadge(bugDetails.fix_status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main bug details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-md font-semibold">Description</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{bugDetails.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-md font-semibold">Steps to Reproduce</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{bugDetails.steps_to_reproduce}</p>
          </div>

          {bugDetails.test_case_result && (
            <div className="space-y-4">
              <h2 className="text-md font-semibold">Test Case Results</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">Result:</span>
                  {getStatusBadge(bugDetails.test_case_result.result)}
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-sm">Remarks:</span>
                  <p className="text-sm text-gray-700">{bugDetails.test_case_result.remarks}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium text-sm">Execution Date:</span>
                  <p className="text-sm text-gray-700">{formatDate(bugDetails.test_case_result.execution_date)}</p>
                </div>
              </div>
            </div>
          )}

          {bugDetails.attachments && bugDetails.attachments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-md font-semibold">Attachments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bugDetails.attachments.map(attachment => (
                  <a 
                    key={attachment.id}
                    href={attachment.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <PaperclipIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-blue-600 truncate">
                      {attachment.file.split('/').pop()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <button 
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                hasExistingTask
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={hasExistingTask ? undefined : handleAddTaskClick}
              disabled={hasExistingTask}
            >
              <Plus size={16} />
              {hasExistingTask ? "Task Added" : "Add Task"}
            </button>
            {hasExistingTask && (
              <p className="text-xs text-gray-500 mt-1">A task has already been added for this bug</p>
            )}
          </div>

          {bugDetails.fix_task && (
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-md font-semibold">Fix Task</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-4">
                  <div>
                    <span className="text-xs text-gray-500">Task ID</span>
                    <p className="text-sm font-medium">{bugDetails.fix_task.task_id}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Status</span>
                    <div>{getStatusBadge(bugDetails.fix_task.status)}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Priority</span>
                    <p className="text-sm font-medium capitalize">{bugDetails.fix_task.priority}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Due Date</span>
                    <p className="text-sm font-medium">{bugDetails.fix_task.due_date}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-gray-500">Project Name</span>
                  <p className="text-sm font-medium">{bugDetails.fix_task.project_name}</p>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-gray-500">Task Name</span>
                  <p className="text-sm font-medium">{bugDetails.fix_task.task_name}</p>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-gray-500">Description</span>
                  <p className="text-sm text-gray-700 mt-1">{bugDetails.fix_task.task_description}</p>
                </div>
                {bugDetails.fix_task.document && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500">Document</span>
                    <div className="mt-1">
                      <a 
                        href={bugDetails.fix_task.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <FileText size={14} />
                        View Document
                      </a>
                    </div>
                  </div>
                )}
                {bugDetails.fix_task.assigned_to && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500">Assigned To</span>
                    <div className="mt-1 flex items-center gap-2">
                      {bugDetails.fix_task.assigned_to.profile_picture && (
                        <img 
                          src={bugDetails.fix_task.assigned_to.profile_picture} 
                          alt={bugDetails.fix_task.assigned_to.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium">{bugDetails.fix_task.assigned_to.name}</p>
                        <p className="text-xs text-gray-500">{bugDetails.fix_task.assigned_to.email}</p>
                      </div>
                    </div>
                    {(bugDetails.fix_task.assigned_to.role || bugDetails.fix_task.assigned_to.specialization) && (
                      <div className="mt-1">
                        {bugDetails.fix_task.assigned_to.role && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                            {bugDetails.fix_task.assigned_to.role}
                          </span>
                        )}
                        {bugDetails.fix_task.assigned_to.specialization && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded ml-1">
                            {bugDetails.fix_task.assigned_to.specialization}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {bugDetails.fix_task.comments && bugDetails.fix_task.comments.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500">Comments</span>
                    <div className="mt-2 space-y-3">
                      {bugDetails.fix_task.comments.map(comment => (
                        <div key={comment.id} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{comment.user_name}</span>
                            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Meta information */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Bug Information</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 block">Created</span>
                <span className="text-sm">{formatDate(bugDetails.created_at)}</span>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 block">Environment</span>
                <span className="text-sm">{bugDetails.environment || 'Not specified'}</span>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 block">Priority</span>
                <span className="text-sm font-medium">{bugDetails.priority}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-3">People</h3>
            
            <div className="space-y-4">
              {bugDetails.reported_by && (
                <div>
                  <span className="text-xs text-gray-500 block">Reported By</span>
                  <span className="text-sm font-medium">{bugDetails.reported_by.full_name}</span>
                </div>
              )}
              
              {bugDetails.assigned_to && bugDetails.assigned_to.user_details && (
                <div>
                  <span className="text-xs text-gray-500 block">Assigned To</span>
                  <div className="flex items-center gap-2">
                    {bugDetails.assigned_to.user_details.profile_picture && (
                      <img 
                        src={bugDetails.assigned_to.user_details.profile_picture} 
                        alt={bugDetails.assigned_to.user_details.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium">{bugDetails.assigned_to.user_details.name}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500">{bugDetails.assigned_to.user_details.email}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                      {bugDetails.assigned_to.user_details.role}
                    </span>
                    {bugDetails.assigned_to.user_details.specialization && (
                      <span className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded ml-1">
                        {bugDetails.assigned_to.user_details.specialization}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Popup */}
      {showAddTaskPopup && selectedBug && projectId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <AddTaskPopup
              bugId={selectedBug.id}
              moduleId={selectedModule}
              projectId={projectId}
              onClose={handleClosePopup}
              onTaskAdded={handleTaskAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BugDetails;