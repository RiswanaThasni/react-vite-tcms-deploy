// import React, { useEffect, useState } from 'react';
// import { getProjectByQa } from '../../../redux/slices/projectSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchModules } from '../../../redux/slices/moduleSlice';
// import { getBugDetails, getFailedTestCases, getPassedTestCases, getTestCaseBugs } from '../../../api/testApi';
// import { ReportBug } from '../../../api/bugApi';
// import { Search } from 'lucide-react';


// const BugManagement = () => {
//   const dispatch = useDispatch();
//   const [selectedProject, setSelectedProject] = useState(null);
//   const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);

//   // State for Test Cases and Bugs
//   const [testCases, setTestCases] = useState([]);
//   const [bugs, setBugs] = useState([]);
//   const [loadingTestCases, setLoadingTestCases] = useState(false);
//   const [loadingBugs, setLoadingBugs] = useState(false);
//   const [errorTestCases, setErrorTestCases] = useState(null);
//   const [errorBugs, setErrorBugs] = useState(null);
//   const [bugDetails, setBugDetails] = useState(null);
//   const [loadingBugDetails, setLoadingBugDetails] = useState(false);
//   const [errorBugDetails, setErrorBugDetails] = useState(null);
  
//   // UI state
//   const [selectedBug, setSelectedBug] = useState(null);
//   const [isAddingBug, setIsAddingBug] = useState(false);
//   const [selectedTestCase, setSelectedTestCase] = useState(null);
//   const [attachmentFiles, setAttachmentFiles] = useState([]);

//   // New bug form state
//   const [newBug, setNewBug] = useState({
//     id: '',
//     bugId: '',
//     title: '',
//     description: '',
//     stepsToReproduce: '',
//     severity: 'Minor',
//     priority: 'Medium',
//     status: 'Open',
//     assignedTo: '',
//     reportedBy: 'Current User',
//     environmentInfo: '',
//     attachments: []
//   });

//   // Add file attachment handler
//   const handleFileAttachment = (event) => {
//     const files = Array.from(event.target.files);
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
//     const maxSize = 10 * 1024 * 1024;
//     const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxSize);
//     setAttachmentFiles(prev => [...prev, ...validFiles]);
//   };

//   // Fetch projects on component mount
//   useEffect(() => {
//     dispatch(getProjectByQa());
//   }, [dispatch]);  

//   // Fetch modules when a project is selected
//   useEffect(() => {
//     if (selectedProject) {
//       dispatch(fetchModules(selectedProject));
//       setSelectedModule(null);
//       setSelectedTestCase(null);
//       setSelectedBug(null);
//       setBugs([]);
//     }
//   }, [selectedProject, dispatch]);

//   // Fetch failed test cases when a module is selected
//   useEffect(() => {
//     if (selectedModule) {
//       fetchFailedTestCases(selectedModule);
//       setSelectedTestCase(null);
//       setSelectedBug(null);
//       setBugs([]);
//     }
//   }, [selectedModule]);

//   // Fetch bugs when a test case is selected
//   useEffect(() => {
//     if (selectedTestCase) {
//       fetchBugsForTestCase(selectedTestCase);
//       setSelectedBug(null);
//     }
//   }, [selectedTestCase]);

//   // Function to fetch failed test cases for a module
//   const fetchFailedTestCases = async (moduleId) => {
//     setLoadingTestCases(true);
//     setErrorTestCases(null);
//     try {
//       const response = await getFailedTestCases(moduleId);
//       setTestCases(response);
//     } catch (error) {
//       console.error("Error fetching test cases:", error);
//       setErrorTestCases(error.message || "Failed to load test cases");
//     } finally {
//       setLoadingTestCases(false);
//     }
//   };

//   // Function to fetch bugs for a test case
//   const fetchBugsForTestCase = async (testCaseId) => {
//     setLoadingBugs(true);
//     setErrorBugs(null);
//     try {
//       const response = await getTestCaseBugs(testCaseId);
//       setBugs(response);
//     } catch (error) {
//       console.error("Error fetching bugs:", error);
//       setErrorBugs(error.message || "Failed to load bugs");
//     } finally {
//       setLoadingBugs(false);
//     }
//   };

//   // Handlers
//   const handleProjectSelect = (projectId) => setSelectedProject(projectId);
//   const handleModuleSelect = (moduleId) => setSelectedModule(moduleId);
//   const handleTestCaseSelect = (testCaseId) => {
//     setSelectedTestCase(testCaseId);
//     setNewBug({...newBug, testCaseId});
//   };

//   // const handleBugSelect = async (bugId) => {
//   //   setSelectedBug(bugId);
//   //   setLoadingBugDetails(true);
//   //   setErrorBugDetails(null);
//   //   try {
//   //     const details = await getBugDetails(bugId);
//   //     setBugDetails(details);
//   //   } catch (error) {
//   //     console.error("Error fetching bug details:", error);
//   //     setErrorBugDetails(error.message || "Failed to load bug details");
//   //   } finally {
//   //     setLoadingBugDetails(false);
//   //   }
//   // };

//   const handleBugSelect = async (bugId) => {
//     setSelectedBug(bugId);
//     setLoadingBugDetails(true);
//     setErrorBugDetails(null);
//     try {
//       const details = await getBugDetails(bugId);
//       setBugDetails(details);
//     } catch (error) {
//       console.error("Error fetching bug details:", error);
//       setErrorBugDetails(error.message || "Failed to load bug details");
//     } finally {
//       setLoadingBugDetails(false);
//     }
//   };

//   const handleAddBug = async () => {
//     if (!selectedTestCase || !newBug.title) return;
    
//     // Generate a temporary ID that will be used until we get the real one from the server
//     const tempId = `temp-${Date.now()}`;
    
//     try {
//       const formData = new FormData();
      
//       // Create the bug object with the structure the backend expects
//       const bugData = {
//         bug_id: newBug.bugId || `BUG-${Date.now()}`, 
//         title: newBug.title,
//         description: newBug.description,
//         priority: newBug.priority.toLowerCase(),
//         severity: newBug.severity.toLowerCase(),
//         steps_to_reproduce: newBug.stepsToReproduce,
//         environment: newBug.environmentInfo
//       };
  
//       // Add bug data with the key "bug" as expected by the backend
//       formData.append('bug', JSON.stringify(bugData));
      
//       // Add remarks separately
//       formData.append('remarks', newBug.description);
      
//       // Add attachments
//       attachmentFiles.forEach((file) => {
//         formData.append('attachment', file);
//       });
      
//       // Add the temporary bug to the UI first for immediate feedback
//       const temporaryBug = {
//         id: tempId,
//         bug_id: bugData.bug_id,
//         title: newBug.title, 
//         description: newBug.description,
//         severity: newBug.severity,
//         priority: newBug.priority,
//         status: 'Open',
//         stepsToReproduce: newBug.stepsToReproduce,
//         environmentInfo: newBug.environmentInfo,
//         reportedBy: "Current User",
//         reportedDate: new Date().toISOString(),
//         // Include more fields as needed
//       };
      
//       // Update the UI immediately
//       setBugs(prevBugs => [...prevBugs, temporaryBug]);
      
//       // Now make the API call
//       const reportedBug = await ReportBug(selectedTestCase, formData);
      
//       // Replace the temporary bug with the real one
//       setBugs(prevBugs => prevBugs.map(bug => 
//         bug.id === tempId ? {
//           ...reportedBug,
//           id: reportedBug.id || reportedBug.bug.id,
//           severity: reportedBug.severity || newBug.severity,
//           status: reportedBug.status || 'Open',
//           description: reportedBug.description || newBug.description
//         } : bug
//       ));
      
//       // Reset the form
//       setNewBug({
//         id: '', bugId: '', title: '', description: '', stepsToReproduce: '',
//         severity: 'Minor', priority: 'Medium', status: 'Open', assignedTo: '',
//         reportedBy: 'Current User', environmentInfo: '', attachments: []
//       });
//       setAttachmentFiles([]);
//       setIsAddingBug(false);
//     } catch (error) {
//       console.error("Error reporting bug:", error.response?.data || error.message);
//       alert(error.response?.data?.error || "Failed to report bug");
      
//       // Remove the temporary bug if the API call failed
//       setBugs(prevBugs => prevBugs.filter(bug => bug.id !== tempId));
//     }
//   };
//   // Helper functions for UI display
//   const getFailedTestCasesByModuleId = () => testCases.filter(t => t.status === 'Failed' || t.status === 'failed');
//   const getTestCaseById = (testCaseId) => testCases.find(t => t.id === testCaseId);
  
//   const getBugStatusClass = (status) => {
//     if (!status) return 'bg-gray-100 text-gray-800';
//     switch (status.toLowerCase()) {
//       case 'open': return 'bg-red-100 text-red-800';
//       case 'in progress':
//       case 'in_progress': return 'bg-yellow-100 text-yellow-800';
//       case 'fixed': return 'bg-blue-100 text-blue-800';
//       case 'verified': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getSeverityClass = (severity) => {
//     if (!severity) return 'bg-gray-100 text-gray-800';
//     switch (severity.toLowerCase()) {
//       case 'critical': return 'bg-red-100 text-red-800';
//       case 'major': return 'bg-orange-100 text-orange-800';
//       case 'minor': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className='flex gap-3'>
//         <div className="flex gap-2 mb-2">
//           <select
//             className="bg-white text-sm text-black rounded-lg p-2"
//             onChange={(e) => handleProjectSelect(e.target.value)}
//             value={selectedProject || ''}
//           >
//             <option value="">--Select Project--</option>
//             {projects.map((project) => (
//               <option key={project.id} value={project.id}>
//                 {project.project_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex gap-2 mb-2">
//           <select
//             className="bg-white text-sm text-black rounded-lg p-2"
//             onChange={(e) => handleModuleSelect(e.target.value)}
//             value={selectedModule || ''}
//             disabled={!selectedProject}
//           >
//             <option value="">--Select Module--</option>
//             {modules.map((module) => (
//               <option key={module.id} value={module.id}>
//                 {module.module_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-1">
//         {/* Middle Panel: Failed Test Cases */}
//         <div className="bg-slate-200 p-4 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-base font-semibold mb-3">Failed Test Cases</h2>
//           </div>
          
//           {loadingTestCases ? (
//             <p className="text-sm text-gray-500">Loading test cases...</p>
//           ) : errorTestCases ? (
//             <p className="text-sm text-red-500">{errorTestCases}</p>
//           ) : selectedModule ? (
//             <div className="space-y-2">
//               {getFailedTestCasesByModuleId().length > 0 ? (
//                 getFailedTestCasesByModuleId().map(testCase => (
//                   <div 
//                     key={testCase.id}
//                     className={`p-3 border rounded-md cursor-pointer ${
//                       selectedTestCase === testCase.id ? 'bg-red-50 border-red-300' : 'bg-white hover:bg-gray-50'
//                     }`}
//                     onClick={() => handleTestCaseSelect(testCase.id)}
//                   >
//                     <div className="font-medium text-sm">{testCase.test_title || testCase.name}</div>
//                     <div className="flex justify-between items-center mt-2">
//                       <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
//                         Failed
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500">No failed test cases in this module</p>
//               )}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500">Select a module to view failed test cases</p>
//           )}
//         </div>
        
//         <div className="col-span-3 mt-2 bg-slate-200 p-4 rounded-lg shadow-md">
//           {isAddingBug ? (
//             <div className="bg-white p-4 rounded-lg border">
//               <h2 className="text-lg font-semibold mb-4">Report Bug</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Bug ID (Optional)</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded text-sm"
//                     value={newBug.bugId}
//                     onChange={(e) => setNewBug({...newBug, bugId: e.target.value})}
//                     placeholder="Enter Bug ID (Leave blank for auto-generation)"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded text-sm"
//                     value={newBug.title}
//                     onChange={(e) => setNewBug({...newBug, title: e.target.value})}
//                     placeholder="Brief description of the bug"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     className="w-full p-2 border rounded text-sm"
//                     rows="3"
//                     value={newBug.description}
//                     onChange={(e) => setNewBug({...newBug, description: e.target.value})}
//                     placeholder="Detailed description of the bug"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
//                   <textarea
//                     className="w-full p-2 border rounded text-sm"
//                     rows="3"
//                     value={newBug.stepsToReproduce}
//                     onChange={(e) => setNewBug({...newBug, stepsToReproduce: e.target.value})}
//                     placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
//                     <select
//                       className="w-full p-2 border rounded text-sm"
//                       value={newBug.severity}
//                       onChange={(e) => setNewBug({...newBug, severity: e.target.value})}
//                     >
//                       <option value="Critical">Critical</option>
//                       <option value="Major">Major</option>
//                       <option value="Minor">Minor</option>
//                       <option value="Trivial">Trivial</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                     <select
//                       className="w-full p-2 border rounded text-sm"
//                       value={newBug.priority}
//                       onChange={(e) => setNewBug({...newBug, priority: e.target.value})}
//                     >
//                       <option value="High">High</option>
//                       <option value="Medium">Medium</option>
//                       <option value="Low">Low</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Environment Information</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded text-sm"
//                     value={newBug.environmentInfo}
//                     onChange={(e) => setNewBug({...newBug, environmentInfo: e.target.value})}
//                     placeholder="OS, Browser, Device, etc."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*, video/*"
//                     className="w-full p-2 border rounded text-sm"
//                     onChange={handleFileAttachment}
//                   />
//                   {attachmentFiles.length > 0 && (
//                     <div className="mt-1 text-sm text-gray-600">
//                       {attachmentFiles.length} file(s) selected
//                     </div>
//                   )}
//                   <p className="text-xs text-gray-500 mt-1">
//                     Allowed: Images (JPEG, PNG, GIF) and Videos (MP4, WebM). Max 10MB per file.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="mt-4 flex justify-end space-x-3">
//                 <button 
//                   className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
//                   onClick={() => setIsAddingBug(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
//                   onClick={handleAddBug}
//                 >
//                   Submit Bug
//                 </button>
//               </div>
//             </div>
//           ) : selectedTestCase ? (
//             <div className=''>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-base font-semibold mb-3">
//                   Bugs for: {getTestCaseById(selectedTestCase)?.test_title || getTestCaseById(selectedTestCase)?.name}
//                 </h2>
//                 <button 
//                   className="text-sm px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
//                   onClick={() => setIsAddingBug(true)}
//                 >
//                   Report New Bug
//                 </button>
//               </div>
              
//               {loadingBugs ? (
//                 <p className="text-sm text-gray-500">Loading bugs...</p>
//               ) : errorBugs ? (
//                 <p className="text-sm text-red-500">{errorBugs}</p>
//               ) : (
//                 <div className="space-y-4">
//                   {bugs.length > 0 ? (
//                     bugs.map(bug => (
//                       <div 
//                         key={bug.id} 
//                         className={`p-3 border rounded-lg ${
//                           selectedBug === bug.id ? 'bg-blue-50 border-blue-300' : 'bg-white'
//                         } cursor-pointer`}
//                         onClick={() => handleBugSelect(bug.id)}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-medium text-sm">{bug.title}</h3>
//                           <div className="flex space-x-2">
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityClass(bug.severity)}`}>
//                               {bug.severity}
//                             </span>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBugStatusClass(bug.status)}`}>
//                               {bug.status}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <p className="text-xs mb-2">{bug.description}</p>
                        
//                         {selectedBug === bug.id && (
//                           <div className="mt-3 space-y-3">
//                             {loadingBugDetails ? (
//                               <p className="text-sm text-gray-500">Loading bug details...</p>
//                             ) : errorBugDetails ? (
//                               <p className="text-sm text-red-500">{errorBugDetails}</p>
//                             ) : bugDetails ? (
//                               <>
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Steps to Reproduce</h4>
//                                   <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">
//                                     {bugDetails.steps_to_reproduce || "Not provided"}
//                                   </pre>
//                                 </div>
                                
//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Reported By</h4>
//                                     <p className="text-xs">
//                                       {bugDetails.reported_by?.full_name || "Unknown"} on {bugDetails.created_at ? new Date(bugDetails.created_at).toLocaleDateString() : "Unknown date"}
//                                     </p>
//                                   </div>
//                                 </div>
                                
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Environment</h4>
//                                   <p className="text-xs">{bugDetails.environment || "Not specified"}</p>
//                                 </div>
                                
//                                 {bugDetails.attachments && bugDetails.attachments.length > 0 && (
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Attachments</h4>
//                                     <div className="flex flex-wrap gap-2">
//                                       {bugDetails.attachments.map(attachment => (
//                                         <a 
//                                           key={attachment.id}
//                                           href={attachment.file}
//                                           target="_blank"
//                                           rel="noreferrer"
//                                           className="text-xs text-blue-600 hover:underline"
//                                         >
//                                           {attachment.file.split('/').pop()}
//                                         </a>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             ) : (
//                               // Fallback to original data if no details fetched yet
//                               <>
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Steps to Reproduce</h4>
//                                   <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">{bug.stepsToReproduce || "Not provided"}</pre>
//                                 </div>
                                
//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Reported By</h4>
//                                     <p className="text-xs">
//                                       {typeof bug.reportedBy === 'object' ? bug.reportedBy.full_name : bug.reportedBy || 
//                                         typeof bug.reported_by === 'object' ? bug.reported_by.full_name : bug.reported_by || 
//                                         "Unknown"} on {bug.reportedDate || bug.created_at || "Unknown date"}
//                                     </p>
//                                   </div>
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Assigned To</h4>
//                                     <p className="text-xs">
//                                       {typeof bug.assignedTo === 'object' ? bug.assignedTo.full_name : bug.assignedTo || 
//                                         typeof bug.assigned_to === 'object' ? bug.assigned_to.full_name : bug.assigned_to || 
//                                         'Unassigned'}
//                                     </p>
//                                   </div>
//                                 </div>
                                
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Environment</h4>
//                                   <p className="text-xs">{bug.environmentInfo || bug.environment_info || "Not specified"}</p>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">No bugs reported for this test case yet</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full py-12">
//               <div className="text-center">
//                 <p className="text-sm text-gray-500">Select a failed test case to view or report bugs</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BugManagement;


// import React, { useEffect, useState } from 'react';
// import { getProjectByQa } from '../../../redux/slices/projectSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchModules } from '../../../redux/slices/moduleSlice';
// import { getBugDetails, getFailedTestCases, getPassedTestCases, getTestCaseBugs } from '../../../api/testApi';
// import { ReportBug } from '../../../api/bugApi';
// import { Search } from 'lucide-react';


// const BugManagement = () => {
//   const dispatch = useDispatch();
//   const [selectedProject, setSelectedProject] = useState(null);
//   const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);

//   // State for Test Cases and Bugs
//   const [testCases, setTestCases] = useState([]);
//   const [bugs, setBugs] = useState([]);
//   const [loadingTestCases, setLoadingTestCases] = useState(false);
//   const [loadingBugs, setLoadingBugs] = useState(false);
//   const [errorTestCases, setErrorTestCases] = useState(null);
//   const [errorBugs, setErrorBugs] = useState(null);
//   const [bugDetails, setBugDetails] = useState(null);
//   const [loadingBugDetails, setLoadingBugDetails] = useState(false);
//   const [errorBugDetails, setErrorBugDetails] = useState(null);


//   // Add this to your state declarations
// const [passedTestCases, setPassedTestCases] = useState([]);
// const [loadingPassedTestCases, setLoadingPassedTestCases] = useState(false);
// const [errorPassedTestCases, setErrorPassedTestCases] = useState(null);
// const [activeTab, setActiveTab] = useState('all'); // 'all', 'failed', 'passed'
  
//   // UI state
//   const [selectedBug, setSelectedBug] = useState(null);
//   const [isAddingBug, setIsAddingBug] = useState(false);
//   const [selectedTestCase, setSelectedTestCase] = useState(null);
//   const [attachmentFiles, setAttachmentFiles] = useState([]);


  

//   // New bug form state
//   const [newBug, setNewBug] = useState({
//     id: '',
//     bugId: '',
//     title: '',
//     description: '',
//     stepsToReproduce: '',
//     severity: 'Minor',
//     priority: 'Medium',
//     status: 'Open',
//     assignedTo: '',
//     reportedBy: 'Current User',
//     environmentInfo: '',
//     attachments: []
//   });

//   // Add file attachment handler
//   const handleFileAttachment = (event) => {
//     const files = Array.from(event.target.files);
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
//     const maxSize = 10 * 1024 * 1024;
//     const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxSize);
//     setAttachmentFiles(prev => [...prev, ...validFiles]);
//   };

//   // Fetch projects on component mount
//   useEffect(() => {
//     dispatch(getProjectByQa());
//   }, [dispatch]);  

//   // Fetch modules when a project is selected
//   useEffect(() => {
//     if (selectedProject) {
//       dispatch(fetchModules(selectedProject));
//       setSelectedModule(null);
//       setSelectedTestCase(null);
//       setSelectedBug(null);
//       setBugs([]);
//     }
//   }, [selectedProject, dispatch]);

//   // Fetch failed test cases when a module is selected
//   useEffect(() => {
//     if (selectedModule) {
//       fetchFailedTestCases(selectedModule);
//       fetchPassedTestCases(selectedModule);
//       setSelectedTestCase(null);
//       setSelectedBug(null);
//       setBugs([]);
//     }
//   }, [selectedModule]);
  

//   // Fetch bugs when a test case is selected
//   useEffect(() => {
//     if (selectedTestCase) {
//       fetchBugsForTestCase(selectedTestCase);
//       setSelectedBug(null);
//     }
//   }, [selectedTestCase]);

//   // Function to fetch failed test cases for a module
//   const fetchFailedTestCases = async (moduleId) => {
//     setLoadingTestCases(true);
//     setErrorTestCases(null);
//     try {
//       const response = await getFailedTestCases(moduleId);
//       setTestCases(response);
//     } catch (error) {
//       console.error("Error fetching test cases:", error);
//       setErrorTestCases(error.message || "Failed to load test cases");
//     } finally {
//       setLoadingTestCases(false);
//     }
//   };

//   const fetchPassedTestCases = async (moduleId) => {
//     setLoadingPassedTestCases(true);
//     setErrorPassedTestCases(null);
//     try {
//       const response = await getPassedTestCases(moduleId);
//       setPassedTestCases(response);
//     } catch (error) {
//       console.error("Error fetching passed test cases:", error);
//       setErrorPassedTestCases(error.message || "Failed to load passed test cases");
//     } finally {
//       setLoadingPassedTestCases(false);
//     }
//   };

//   // Function to fetch bugs for a test case
//   const fetchBugsForTestCase = async (testCaseId) => {
//     setLoadingBugs(true);
//     setErrorBugs(null);
//     try {
//       const response = await getTestCaseBugs(testCaseId);
//       setBugs(response);
//     } catch (error) {
//       console.error("Error fetching bugs:", error);
//       setErrorBugs(error.message || "Failed to load bugs");
//     } finally {
//       setLoadingBugs(false);
//     }
//   };

//   // Handlers
//   const handleProjectSelect = (projectId) => setSelectedProject(projectId);
//   const handleModuleSelect = (moduleId) => setSelectedModule(moduleId);
//   const handleTestCaseSelect = (testCaseId) => {
//     setSelectedTestCase(testCaseId);
//     setNewBug({...newBug, testCaseId});
//   };

 

//   const handleBugSelect = async (bugId) => {
//     setSelectedBug(bugId);
//     setLoadingBugDetails(true);
//     setErrorBugDetails(null);
//     try {
//       const details = await getBugDetails(bugId);
//       setBugDetails(details);
//     } catch (error) {
//       console.error("Error fetching bug details:", error);
//       setErrorBugDetails(error.message || "Failed to load bug details");
//     } finally {
//       setLoadingBugDetails(false);
//     }
//   };

//   const handleAddBug = async () => {
//     if (!selectedTestCase || !newBug.title) return;
    
//     // Generate a temporary ID that will be used until we get the real one from the server
//     const tempId = `temp-${Date.now()}`;
    
//     try {
//       const formData = new FormData();
      
//       // Create the bug object with the structure the backend expects
//       const bugData = {
//         bug_id: newBug.bugId || `BUG-${Date.now()}`, 
//         title: newBug.title,
//         description: newBug.description,
//         priority: newBug.priority.toLowerCase(),
//         severity: newBug.severity.toLowerCase(),
//         steps_to_reproduce: newBug.stepsToReproduce,
//         environment: newBug.environmentInfo
//       };
  
//       // Add bug data with the key "bug" as expected by the backend
//       formData.append('bug', JSON.stringify(bugData));
      
//       // Add remarks separately
//       formData.append('remarks', newBug.description);
      
//       // Add attachments
//       attachmentFiles.forEach((file) => {
//         formData.append('attachment', file);
//       });
      
//       // Add the temporary bug to the UI first for immediate feedback
//       const temporaryBug = {
//         id: tempId,
//         bug_id: bugData.bug_id,
//         title: newBug.title, 
//         description: newBug.description,
//         severity: newBug.severity,
//         priority: newBug.priority,
//         status: 'Open',
//         stepsToReproduce: newBug.stepsToReproduce,
//         environmentInfo: newBug.environmentInfo,
//         reportedBy: "Current User",
//         reportedDate: new Date().toISOString(),
//         // Include more fields as needed
//       };
      
//       // Update the UI immediately
//       setBugs(prevBugs => [...prevBugs, temporaryBug]);
      
//       // Now make the API call
//       const reportedBug = await ReportBug(selectedTestCase, formData);
      
//       // Replace the temporary bug with the real one
//       setBugs(prevBugs => prevBugs.map(bug => 
//         bug.id === tempId ? {
//           ...reportedBug,
//           id: reportedBug.id || reportedBug.bug.id,
//           severity: reportedBug.severity || newBug.severity,
//           status: reportedBug.status || 'Open',
//           description: reportedBug.description || newBug.description
//         } : bug
//       ));
      
//       // Reset the form
//       setNewBug({
//         id: '', bugId: '', title: '', description: '', stepsToReproduce: '',
//         severity: 'Minor', priority: 'Medium', status: 'Open', assignedTo: '',
//         reportedBy: 'Current User', environmentInfo: '', attachments: []
//       });
//       setAttachmentFiles([]);
//       setIsAddingBug(false);
//     } catch (error) {
//       console.error("Error reporting bug:", error.response?.data || error.message);
//       alert(error.response?.data?.error || "Failed to report bug");
      
//       // Remove the temporary bug if the API call failed
//       setBugs(prevBugs => prevBugs.filter(bug => bug.id !== tempId));
//     }
//   };
//   // Helper functions for UI display
//   const getFailedTestCasesByModuleId = () => testCases.filter(t => t.status === 'Failed' || t.status === 'failed');
// // Replace your getTestCaseById function
// const getTestCaseById = (testCaseId) => {
//   const foundInFailed = testCases.find(t => t.id === testCaseId);
//   if (foundInFailed) return foundInFailed;
  
//   return passedTestCases.find(t => t.id === testCaseId);
// };  
//   const getBugStatusClass = (status) => {
//     if (!status) return 'bg-gray-100 text-gray-800';
//     switch (status.toLowerCase()) {
//       case 'open': return 'bg-red-100 text-red-800';
//       case 'in progress':
//       case 'in_progress': return 'bg-yellow-100 text-yellow-800';
//       case 'fixed': return 'bg-blue-100 text-blue-800';
//       case 'verified': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getSeverityClass = (severity) => {
//     if (!severity) return 'bg-gray-100 text-gray-800';
//     switch (severity.toLowerCase()) {
//       case 'critical': return 'bg-red-100 text-red-800';
//       case 'major': return 'bg-orange-100 text-orange-800';
//       case 'minor': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Add this helper function
// const getAllTestCases = () => {
//   if (activeTab === 'failed') return getFailedTestCasesByModuleId();
//   if (activeTab === 'passed') return passedTestCases;
//   // Combine both for 'all' tab
//   return [...getFailedTestCasesByModuleId(), ...passedTestCases];
// };

//   return (
//     <div className="p-4">
//       <div className='flex gap-3'>
//         <div className="flex gap-2 mb-2">
//           <select
//             className="bg-white text-sm text-black rounded-lg p-2"
//             onChange={(e) => handleProjectSelect(e.target.value)}
//             value={selectedProject || ''}
//           >
//             <option value="">--Select Project--</option>
//             {projects.map((project) => (
//               <option key={project.id} value={project.id}>
//                 {project.project_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex gap-2 mb-2">
//           <select
//             className="bg-white text-sm text-black rounded-lg p-2"
//             onChange={(e) => handleModuleSelect(e.target.value)}
//             value={selectedModule || ''}
//             disabled={!selectedProject}
//           >
//             <option value="">--Select Module--</option>
//             {modules.map((module) => (
//               <option key={module.id} value={module.id}>
//                 {module.module_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-1">
//         {/* Middle Panel: Failed Test Cases */}
//        {/* Replace the test cases display section */}
// <div className="bg-slate-200 p-4 rounded-lg shadow-md">
//   <div className="flex justify-between items-center mb-4">
//     <h2 className="text-base font-semibold mb-3">Test Cases</h2>
//     <div className="flex gap-2">
//       <button 
//         className={`text-xs px-3 py-1 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         onClick={() => setActiveTab('all')}
//       >
//         All
//       </button>
//       <button 
//         className={`text-xs px-3 py-1 rounded ${activeTab === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
//         onClick={() => setActiveTab('failed')}
//       >
//         Failed
//       </button>
//       <button 
//         className={`text-xs px-3 py-1 rounded ${activeTab === 'passed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
//         onClick={() => setActiveTab('passed')}
//       >
//         Passed
//       </button>
//     </div>
//   </div>
  
//   {(loadingTestCases || loadingPassedTestCases) ? (
//     <p className="text-sm text-gray-500">Loading test cases...</p>
//   ) : (errorTestCases || errorPassedTestCases) ? (
//     <p className="text-sm text-red-500">{errorTestCases || errorPassedTestCases}</p>
//   ) : selectedModule ? (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//       {getAllTestCases().length > 0 ? (
//         getAllTestCases().map(testCase => (
//           <div 
//             key={testCase.id}
//             className={`p-3 border rounded-md cursor-pointer ${
//               selectedTestCase === testCase.id ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
//             }`}
//             onClick={() => handleTestCaseSelect(testCase.id)}
//           >
//             <div className="font-medium text-sm">{testCase.test_title || testCase.name}</div>
//             <div className="flex justify-between items-center mt-2">
//               <span className={`text-xs px-2 py-1 rounded-full font-medium ${
//                 testCase.status === 'Failed' || testCase.status === 'failed' 
//                   ? 'bg-red-100 text-red-800' 
//                   : 'bg-green-100 text-green-800'
//               }`}>
//                 {testCase.status === 'Failed' || testCase.status === 'failed' ? 'Failed' : 'Passed'}
//               </span>
//               <div className="text-xs text-gray-500">
//                 {testCase.test_id || testCase.id}
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-sm text-gray-500 col-span-2">No test cases in this module</p>
//       )}
//     </div>
//   ) : (
//     <p className="text-sm text-gray-500">Select a module to view test cases</p>
//   )}
// </div>
        
//         <div className="col-span-3 mt-2 bg-slate-200 p-4 rounded-lg shadow-md">
//           {isAddingBug ? (
//             <div className="bg-white p-4 rounded-lg border">
//               <h2 className="text-lg font-semibold mb-4">Report Bug</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Bug ID (Optional)</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded text-sm"
//                     value={newBug.bugId}
//                     onChange={(e) => setNewBug({...newBug, bugId: e.target.value})}
//                     placeholder="Enter Bug ID (Leave blank for auto-generation)"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded text-sm"
//                     value={newBug.title}
//                     onChange={(e) => setNewBug({...newBug, title: e.target.value})}
//                     placeholder="Brief description of the bug"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     className="w-full p-2 border rounded text-sm"
//                     rows="3"
//                     value={newBug.description}
//                     onChange={(e) => setNewBug({...newBug, description: e.target.value})}
//                     placeholder="Detailed description of the bug"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
//                   <textarea
//                     className="w-full p-2 border rounded text-sm"
//                     rows="3"
//                     value={newBug.stepsToReproduce}
//                     onChange={(e) => setNewBug({...newBug, stepsToReproduce: e.target.value})}
//                     placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
//                     <select
//                       className="w-full p-2 border rounded text-sm"
//                       value={newBug.severity}
//                       onChange={(e) => setNewBug({...newBug, severity: e.target.value})}
//                     >
//                       <option value="Critical">Critical</option>
//                       <option value="Major">Major</option>
//                       <option value="Minor">Minor</option>
//                       <option value="Trivial">Trivial</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                     <select
//                       className="w-full p-2 border rounded text-sm"
//                       value={newBug.priority}
//                       onChange={(e) => setNewBug({...newBug, priority: e.target.value})}
//                     >
//                       <option value="High">High</option>
//                       <option value="Medium">Medium</option>
//                       <option value="Low">Low</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Environment Information</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded text-sm"
//                     value={newBug.environmentInfo}
//                     onChange={(e) => setNewBug({...newBug, environmentInfo: e.target.value})}
//                     placeholder="OS, Browser, Device, etc."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*, video/*"
//                     className="w-full p-2 border rounded text-sm"
//                     onChange={handleFileAttachment}
//                   />
//                   {attachmentFiles.length > 0 && (
//                     <div className="mt-1 text-sm text-gray-600">
//                       {attachmentFiles.length} file(s) selected
//                     </div>
//                   )}
//                   <p className="text-xs text-gray-500 mt-1">
//                     Allowed: Images (JPEG, PNG, GIF) and Videos (MP4, WebM). Max 10MB per file.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="mt-4 flex justify-end space-x-3">
//                 <button 
//                   className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
//                   onClick={() => setIsAddingBug(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
//                   onClick={handleAddBug}
//                 >
//                   Submit Bug
//                 </button>
//               </div>
//             </div>
//           ) : selectedTestCase ? (
//             <div className=''>
//              {/* Update the top part of the bug display section */}
// <div className="flex justify-between items-center mb-4">
//   <h2 className="text-base font-semibold mb-3">
//     Bugs for: {getTestCaseById(selectedTestCase)?.test_title || getTestCaseById(selectedTestCase)?.name}
//     <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
//       getTestCaseById(selectedTestCase)?.status === 'Failed' || getTestCaseById(selectedTestCase)?.status === 'failed'
//         ? 'bg-red-100 text-red-800' 
//         : 'bg-green-100 text-green-800'
//     }`}>
//       {getTestCaseById(selectedTestCase)?.status === 'Failed' || getTestCaseById(selectedTestCase)?.status === 'failed' ? 'Failed' : 'Passed'}
//     </span>
//   </h2>
//   <button 
//     className="text-sm px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
//     onClick={() => setIsAddingBug(true)}
//   >
//     Report New Bug
//   </button>
// </div>
              
//               {loadingBugs ? (
//                 <p className="text-sm text-gray-500">Loading bugs...</p>
//               ) : errorBugs ? (
//                 <p className="text-sm text-red-500">{errorBugs}</p>
//               ) : (
//                 <div className="space-y-4">
//                   {bugs.length > 0 ? (
//                     bugs.map(bug => (
//                       <div 
//                         key={bug.id} 
//                         className={`p-3 border rounded-lg ${
//                           selectedBug === bug.id ? 'bg-blue-50 border-blue-300' : 'bg-white'
//                         } cursor-pointer`}
//                         onClick={() => handleBugSelect(bug.id)}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-medium text-sm">{bug.title}</h3>
//                           <div className="flex space-x-2">
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityClass(bug.severity)}`}>
//                               {bug.severity}
//                             </span>
//                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBugStatusClass(bug.status)}`}>
//                               {bug.status}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <p className="text-xs mb-2">{bug.description}</p>
                        
//                         {selectedBug === bug.id && (
//                           <div className="mt-3 space-y-3">
//                             {loadingBugDetails ? (
//                               <p className="text-sm text-gray-500">Loading bug details...</p>
//                             ) : errorBugDetails ? (
//                               <p className="text-sm text-red-500">{errorBugDetails}</p>
//                             ) : bugDetails ? (
//                               <>
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Steps to Reproduce</h4>
//                                   <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">
//                                     {bugDetails.steps_to_reproduce || "Not provided"}
//                                   </pre>
//                                 </div>
                                
//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Reported By</h4>
//                                     <p className="text-xs">
//                                       {bugDetails.reported_by?.full_name || "Unknown"} on {bugDetails.created_at ? new Date(bugDetails.created_at).toLocaleDateString() : "Unknown date"}
//                                     </p>
//                                   </div>
//                                 </div>
                                
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Environment</h4>
//                                   <p className="text-xs">{bugDetails.environment || "Not specified"}</p>
//                                 </div>
                                
//                                 {bugDetails.attachments && bugDetails.attachments.length > 0 && (
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Attachments</h4>
//                                     <div className="flex flex-wrap gap-2">
//                                       {bugDetails.attachments.map(attachment => (
//                                         <a 
//                                           key={attachment.id}
//                                           href={attachment.file}
//                                           target="_blank"
//                                           rel="noreferrer"
//                                           className="text-xs text-blue-600 hover:underline"
//                                         >
//                                           {attachment.file.split('/').pop()}
//                                         </a>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             ) : (
//                               // Fallback to original data if no details fetched yet
//                               <>
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Steps to Reproduce</h4>
//                                   <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">{bug.stepsToReproduce || "Not provided"}</pre>
//                                 </div>
                                
//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Reported By</h4>
//                                     <p className="text-xs">
//                                       {typeof bug.reportedBy === 'object' ? bug.reportedBy.full_name : bug.reportedBy || 
//                                         typeof bug.reported_by === 'object' ? bug.reported_by.full_name : bug.reported_by || 
//                                         "Unknown"} on {bug.reportedDate || bug.created_at || "Unknown date"}
//                                     </p>
//                                   </div>
//                                   <div>
//                                     <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Assigned To</h4>
//                                     <p className="text-xs">
//                                       {typeof bug.assignedTo === 'object' ? bug.assignedTo.full_name : bug.assignedTo || 
//                                         typeof bug.assigned_to === 'object' ? bug.assigned_to.full_name : bug.assigned_to || 
//                                         'Unassigned'}
//                                     </p>
//                                   </div>
//                                 </div>
                                
//                                 <div>
//                                   <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Environment</h4>
//                                   <p className="text-xs">{bug.environmentInfo || bug.environment_info || "Not specified"}</p>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">No bugs reported for this test case yet</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full py-12">
//               <div className="text-center">
//                 <p className="text-sm text-gray-500">Select a failed test case to view or report bugs</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BugManagement;



import React, { useEffect, useState } from 'react';
import { getProjectByQa } from '../../../redux/slices/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules } from '../../../redux/slices/moduleSlice';
import { getBugDetails, getFailedTestCases, getPassedTestCases, getTestById, getTestCaseBugs } from '../../../api/testApi';
import { ReportBug } from '../../../api/bugApi';
import { Search } from 'lucide-react';

const BugManagement = () => {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
  const [selectedModule, setSelectedModule] = useState(null);
  const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);

  // State for Test Cases and Bugs
  const [testCases, setTestCases] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [loadingTestCases, setLoadingTestCases] = useState(false);
  const [loadingBugs, setLoadingBugs] = useState(false);
  const [errorTestCases, setErrorTestCases] = useState(null);
  const [errorBugs, setErrorBugs] = useState(null);
  const [bugDetails, setBugDetails] = useState(null);
  const [loadingBugDetails, setLoadingBugDetails] = useState(false);
  const [errorBugDetails, setErrorBugDetails] = useState(null);
  const [passedTestCases, setPassedTestCases] = useState([]);
  const [loadingPassedTestCases, setLoadingPassedTestCases] = useState(false);
  const [errorPassedTestCases, setErrorPassedTestCases] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [testCaseDetails, setTestCaseDetails] = useState(null);
  const [loadingTestCaseDetails, setLoadingTestCaseDetails] = useState(false);
  const [errorTestCaseDetails, setErrorTestCaseDetails] = useState(null);

  // UI state
  const [selectedBug, setSelectedBug] = useState(null);
  const [isAddingBug, setIsAddingBug] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  // New bug form state
  const [newBug, setNewBug] = useState({
    id: '',
    bugId: '',
    title: '',
    description: '',
    stepsToReproduce: '',
    severity: 'Minor',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    reportedBy: 'Current User',
    environmentInfo: '',
    attachments: []
  });

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxSize);
    setAttachmentFiles(prev => [...prev, ...validFiles]);
  };

  useEffect(() => {
    dispatch(getProjectByQa());
  }, [dispatch]);  

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchModules(selectedProject));
      setSelectedModule(null);
      setSelectedTestCase(null);
      setSelectedBug(null);
      setBugs([]);
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    if (selectedModule) {
      fetchFailedTestCases(selectedModule);
      fetchPassedTestCases(selectedModule);
      setSelectedTestCase(null);
      setSelectedBug(null);
      setBugs([]);
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedTestCase) {
      fetchBugsForTestCase(selectedTestCase);
      setSelectedBug(null);
    }
  }, [selectedTestCase]);

  const fetchFailedTestCases = async (moduleId) => {
    setLoadingTestCases(true);
    setErrorTestCases(null);
    try {
      const response = await getFailedTestCases(moduleId);
      setTestCases(response);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      setErrorTestCases(error.message || "Failed to load test cases");
    } finally {
      setLoadingTestCases(false);
    }
  };

  const fetchPassedTestCases = async (moduleId) => {
    setLoadingPassedTestCases(true);
    setErrorPassedTestCases(null);
    try {
      const response = await getPassedTestCases(moduleId);
      setPassedTestCases(response);
    } catch (error) {
      console.error("Error fetching passed test cases:", error);
      setErrorPassedTestCases(error.message || "Failed to load passed test cases");
    } finally {
      setLoadingPassedTestCases(false);
    }
  };

  const fetchBugsForTestCase = async (testCaseId) => {
    setLoadingBugs(true);
    setErrorBugs(null);
    try {
      const response = await getTestCaseBugs(testCaseId);
      setBugs(response);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      setErrorBugs(error.message || "Failed to load bugs");
    } finally {
      setLoadingBugs(false);
    }
  };

  const handleProjectSelect = (projectId) => setSelectedProject(projectId);
  const handleModuleSelect = (moduleId) => setSelectedModule(moduleId);

  const handleTestCaseSelect = async (testCaseId) => {
    setSelectedTestCase(testCaseId);
    setNewBug({...newBug, testCaseId});
    
    // Fetch test details regardless of status
    setLoadingTestCaseDetails(true);
    setErrorTestCaseDetails(null);
    try {
      const details = await getTestById(testCaseId);
      setTestCaseDetails(details);
    } catch (error) {
      console.error("Error fetching test details:", error);
      setErrorTestCaseDetails(error.message || "Failed to load test details");
    } finally {
      setLoadingTestCaseDetails(false);
    }
    
    // Also fetch bugs if it's a failed test case
    const isPassed = passedTestCases.some(t => t.id === testCaseId);
    if (!isPassed) {
      fetchBugsForTestCase(testCaseId);
    }
  };

  const handleBugSelect = async (bugId) => {
    setSelectedBug(bugId);
    setLoadingBugDetails(true);
    setErrorBugDetails(null);
    try {
      const details = await getBugDetails(bugId);
      setBugDetails(details);
    } catch (error) {
      console.error("Error fetching bug details:", error);
      setErrorBugDetails(error.message || "Failed to load bug details");
    } finally {
      setLoadingBugDetails(false);
    }
  };

  const handleAddBug = async () => {
    if (!selectedTestCase || !newBug.title) return;
    
    const tempId = `temp-${Date.now()}`;
    
    try {
      const formData = new FormData();
      const bugData = {
        bug_id: newBug.bugId || `BUG-${Date.now()}`, 
        title: newBug.title,
        description: newBug.description,
        priority: newBug.priority.toLowerCase(),
        severity: newBug.severity.toLowerCase(),
        steps_to_reproduce: newBug.stepsToReproduce,
        environment: newBug.environmentInfo
      };
  
      formData.append('bug', JSON.stringify(bugData));
      formData.append('remarks', newBug.description);
      attachmentFiles.forEach((file) => {
        formData.append('attachment', file);
      });
      
      const temporaryBug = {
        id: tempId,
        bug_id: bugData.bug_id,
        title: newBug.title, 
        description: newBug.description,
        severity: newBug.severity,
        priority: newBug.priority,
        status: 'Open',
        stepsToReproduce: newBug.stepsToReproduce,
        environmentInfo: newBug.environmentInfo,
        reportedBy: "Current User",
        reportedDate: new Date().toISOString(),
      };
      
      setBugs(prevBugs => [...prevBugs, temporaryBug]);
      const reportedBug = await ReportBug(selectedTestCase, formData);
      
      setBugs(prevBugs => prevBugs.map(bug => 
        bug.id === tempId ? {
          ...reportedBug,
          id: reportedBug.id || reportedBug.bug.id,
          severity: reportedBug.severity || newBug.severity,
          status: reportedBug.status || 'Open',
          description: reportedBug.description || newBug.description
        } : bug
      ));
      
      setNewBug({
        id: '', bugId: '', title: '', description: '', stepsToReproduce: '',
        severity: 'Minor', priority: 'Medium', status: 'Open', assignedTo: '',
        reportedBy: 'Current User', environmentInfo: '', attachments: []
      });
      setAttachmentFiles([]);
      setIsAddingBug(false);
    } catch (error) {
      console.error("Error reporting bug:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to report bug");
      setBugs(prevBugs => prevBugs.filter(bug => bug.id !== tempId));
    }
  };

  const getFailedTestCasesByModuleId = () => testCases.filter(t => t.status === 'Failed' || t.status === 'failed');
  
  const getTestCaseById = (testCaseId) => {
    const foundInFailed = testCases.find(t => t.id === testCaseId);
    if (foundInFailed) return foundInFailed;
    return passedTestCases.find(t => t.id === testCaseId);
  };  

  const getBugStatusClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in progress':
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'fixed': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityClass = (severity) => {
    if (!severity) return 'bg-gray-100 text-gray-800';
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'major': return 'bg-orange-100 text-orange-800';
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAllTestCases = () => {
    if (activeTab === 'failed') return getFailedTestCasesByModuleId();
    if (activeTab === 'passed') return passedTestCases;
    return [...getFailedTestCasesByModuleId(), ...passedTestCases];
  };

  return (
    <div className="p-4">
      <div className='flex gap-3'>
        <div className="flex gap-2 mb-2">
          <select
            className="bg-white text-sm text-black rounded-lg p-2"
            onChange={(e) => handleProjectSelect(e.target.value)}
            value={selectedProject || ''}
          >
            <option value="">--Select Project--</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mb-2">
          <select
            className="bg-white text-sm text-black rounded-lg p-2"
            onChange={(e) => handleModuleSelect(e.target.value)}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1">
        {/* Test Cases Panel */}
        <div className="bg-slate-200 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold mb-3">Test Cases</h2>
            <div className="flex gap-2">
              <button 
                className={`text-xs px-3 py-1 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded ${activeTab === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('failed')}
              >
                Failed
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded ${activeTab === 'passed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('passed')}
              >
                Passed
              </button>
            </div>
          </div>
          
          {(loadingTestCases || loadingPassedTestCases) ? (
            <p className="text-sm text-gray-500">Loading test cases...</p>
          ) : (errorTestCases || errorPassedTestCases) ? (
            <p className="text-sm text-red-500">{errorTestCases || errorPassedTestCases}</p>
          ) : selectedModule ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getAllTestCases().length > 0 ? (
                getAllTestCases().map(testCase => (
                  <div 
                    key={testCase.id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedTestCase === testCase.id ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleTestCaseSelect(testCase.id)}
                  >
                    <div className="font-medium text-sm">{testCase.test_title || testCase.name}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        testCase.status === 'Failed' || testCase.status === 'failed' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {testCase.status === 'Failed' || testCase.status === 'failed' ? 'Failed' : 'Passed'}
                      </span>
                      <div className="text-xs text-gray-500">
                        {testCase.test_id || testCase.id}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-2">No test cases in this module</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a module to view test cases</p>
          )}
        </div>
        
        {/* Details Panel */}
        <div className="col-span-3 mt-2 bg-slate-200 p-4 rounded-lg shadow-md">
          {isAddingBug ? (
            <div className="bg-white p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Report Bug</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bug ID (Optional)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    value={newBug.bugId}
                    onChange={(e) => setNewBug({...newBug, bugId: e.target.value})}
                    placeholder="Enter Bug ID (Leave blank for auto-generation)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    value={newBug.title}
                    onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                    placeholder="Brief description of the bug"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    rows="3"
                    value={newBug.description}
                    onChange={(e) => setNewBug({...newBug, description: e.target.value})}
                    placeholder="Detailed description of the bug"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    rows="3"
                    value={newBug.stepsToReproduce}
                    onChange={(e) => setNewBug({...newBug, stepsToReproduce: e.target.value})}
                    placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      className="w-full p-2 border rounded text-sm"
                      value={newBug.severity}
                      onChange={(e) => setNewBug({...newBug, severity: e.target.value})}
                    >
                      <option value="Critical">Critical</option>
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                      <option value="Trivial">Trivial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full p-2 border rounded text-sm"
                      value={newBug.priority}
                      onChange={(e) => setNewBug({...newBug, priority: e.target.value})}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment Information</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    value={newBug.environmentInfo}
                    onChange={(e) => setNewBug({...newBug, environmentInfo: e.target.value})}
                    placeholder="OS, Browser, Device, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*, video/*"
                    className="w-full p-2 border rounded text-sm"
                    onChange={handleFileAttachment}
                  />
                  {attachmentFiles.length > 0 && (
                    <div className="mt-1 text-sm text-gray-600">
                      {attachmentFiles.length} file(s) selected
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Allowed: Images (JPEG, PNG, GIF) and Videos (MP4, WebM). Max 10MB per file.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                  onClick={() => setIsAddingBug(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  onClick={handleAddBug}
                >
                  Submit Bug
                </button>
              </div>
            </div>
          ) : selectedTestCase ? (
            <div className=''>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold mb-3">
                  {getTestCaseById(selectedTestCase)?.test_title || getTestCaseById(selectedTestCase)?.name}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                    getTestCaseById(selectedTestCase)?.status === 'Failed' || 
                    getTestCaseById(selectedTestCase)?.status === 'failed' ?
                      'bg-red-100 text-red-800' : 
                      'bg-green-100 text-green-800'
                  }`}>
                    {getTestCaseById(selectedTestCase)?.status === 'Failed' || 
                     getTestCaseById(selectedTestCase)?.status === 'failed' ? 
                      'Failed' : 'Passed'}
                  </span>
                </h2>
                
                {/* Report Bug button - now shown for both passed and failed test cases */}
                <button 
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                  onClick={() => setIsAddingBug(true)}
                >
                  Report New Bug
                </button>
              </div>
              
              {loadingBugs || loadingTestCaseDetails ? (
                <p className="text-sm text-gray-500">Loading details...</p>
              ) : errorBugs || errorTestCaseDetails ? (
                <p className="text-sm text-red-500">{errorBugs || errorTestCaseDetails}</p>
              ) : testCaseDetails ? (
                // Display test case details for passed tests
                <div className="bg-white p-4 rounded-lg border">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">ID</h3>
                      <p className="text-sm">{testCaseDetails.test_id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Title</h3>
                      <p className="text-sm">{testCaseDetails.test_title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Description</h3>
                      <p className="text-sm">{testCaseDetails.test_description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Priority</h3>
                      <p className="text-sm">{testCaseDetails.priority}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Test Type</h3>
                      <p className="text-sm">{testCaseDetails.test_type_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Precondition</h3>
                      <p className="text-sm">{testCaseDetails.precondition}</p>
                    </div>
                    
                    {/* Test Steps */}
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Test Steps</h3>
                      {testCaseDetails.test_steps && testCaseDetails.test_steps.map(step => (
                        <div key={step.id} className="border-b pb-2 mb-2">
                          <div className="flex items-start gap-2">
                            <span className="font-medium">{step.step_number}.</span>
                            <div>
                              <p className="text-sm">{step.step_description}</p>
                              <p className="text-xs text-gray-500 mt-1">Expected: {step.expected_result}</p>
                              {step.status_details && step.status_details.map(status => (
                                <p key={status.id} className="text-xs mt-1">
                                  <span className={`px-2 py-0.5 rounded-full ${status.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {status.status === 'pass' ? 'Passed' : 'Failed'}
                                  </span>
                                  <span className="ml-2 text-gray-500">{status.remarks}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Assigned Users */}
                    <div>
                      <h3 className="text-sm font-medium uppercase text-gray-500 mb-1">Assigned Users</h3>
                      {testCaseDetails.assigned_users && testCaseDetails.assigned_users.map(user => (
                        <div key={user.user_id} className="text-sm">
                          <span>{user.username}</span>
                          <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {user.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Display bugs for failed tests
                <div className="space-y-4">
                  {bugs.length > 0 ? (
                    bugs.map(bug => (
                      <div 
                        key={bug.id} 
                        className={`p-3 border rounded-lg ${
                          selectedBug === bug.id ? 'bg-blue-50 border-blue-300' : 'bg-white'
                        } cursor-pointer`}
                        onClick={() => handleBugSelect(bug.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{bug.title}</h3>
                          <div className="flex space-x-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityClass(bug.severity)}`}>
                              {bug.severity}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBugStatusClass(bug.status)}`}>
                              {bug.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs mb-2">{bug.description}</p>
                        
                        {selectedBug === bug.id && (
                          <div className="mt-3 space-y-3">
                            {loadingBugDetails ? (
                              <p className="text-sm text-gray-500">Loading bug details...</p>
                            ) : errorBugDetails ? (
                              <p className="text-sm text-red-500">{errorBugDetails}</p>
                            ) : bugDetails ? (
                              <>
                                <div>
                                  <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Steps to Reproduce</h4>
                                  <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">
                                    {bugDetails.steps_to_reproduce || "Not provided"}
                                  </pre>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Reported By</h4>
                                    <p className="text-xs">
                                      {bugDetails.reported_by?.full_name || "Unknown"} on {bugDetails.created_at ? new Date(bugDetails.created_at).toLocaleDateString() : "Unknown date"}
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Environment</h4>
                                  <p className="text-xs">{bugDetails.environment || "Not specified"}</p>
                                </div>
                                
                                {bugDetails.attachments && bugDetails.attachments.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Attachments</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {bugDetails.attachments.map(attachment => (
                                        <a 
                                          key={attachment.id}
                                          href={attachment.file}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-xs text-blue-600 hover:underline"
                                        >
                                          {attachment.file.split('/').pop()}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              // Fallback to original data if no details fetched yet
                              <>
                                <div>
                                  <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Steps to Reproduce</h4>
                                  <pre className="text-xs bg-gray-50 p-2 rounded whitespace-pre-wrap">{bug.stepsToReproduce || "Not provided"}</pre>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Reported By</h4>
                                    <p className="text-xs">
                                      {typeof bug.reportedBy === 'object' ? bug.reportedBy.full_name : bug.reportedBy || 
                                        typeof bug.reported_by === 'object' ? bug.reported_by.full_name : bug.reported_by || 
                                        "Unknown"} on {bug.reportedDate || bug.created_at || "Unknown date"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Assigned To</h4>
                                    <p className="text-xs">
                                      {typeof bug.assignedTo === 'object' ? bug.assignedTo.full_name : bug.assignedTo || 
                                        typeof bug.assigned_to === 'object' ? bug.assigned_to.full_name : bug.assigned_to || 
                                        'Unassigned'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Environment</h4>
                                  <p className="text-xs">{bug.environmentInfo || bug.environment_info || "Not specified"}</p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No bugs reported for this test case yet</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center">
                <p className="text-sm text-gray-500">Select a test case to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugManagement;