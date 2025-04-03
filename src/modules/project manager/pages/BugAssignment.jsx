


// import React, { useEffect, useState } from 'react';
// import { getProjectByLead } from '../../../redux/slices/projectSlice';
// import { fetchModules } from "../../../redux/slices/moduleSlice";
// import { useDispatch, useSelector } from 'react-redux';
// import { Search, CheckCircle, Circle, X, ChevronDown, ChevronUp } from 'lucide-react';
// import { fetchbugsByModuleId, reassignBug } from '../../../api/projectApi';
// import { getDevelopersByProject } from "../../../redux/slices/developerSlice";
// import { fetchTasksByModule } from "../../../redux/slices/taskSlice";

// const BugAssignment = () => {
//   // State and selector setup remains the same
//   const dispatch = useDispatch();
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [bugs, setBugs] = useState([]);
//   const [selectedBugs, setSelectedBugs] = useState([]);
//   const [bugsLoading, setBugsLoading] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [selectedDeveloper, setSelectedDeveloper] = useState(null);
//   const [showBugDetails, setShowBugDetails] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [assignmentLoading, setAssignmentLoading] = useState(false);

//   const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
//   const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);
//   const { developers, loading: developersLoading } = useSelector(state => state.developers);
//   const tasksState = useSelector(state => state.tasks) || { tasks: [], loading: false, error: null };
//   const { tasks = [], loading: tasksLoading, error: tasksError } = tasksState;

//   // useEffects remain the same
//   useEffect(() => {
//     dispatch(getProjectByLead());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedProject) {
//       dispatch(fetchModules(selectedProject));
//       dispatch(getDevelopersByProject(selectedProject));
//       setSelectedModule(null);
//       setBugs([]);
//       setSelectedBugs([]);
//       setSelectedTask(null);
//       setSelectedDeveloper(null);
//       setShowBugDetails(null);
//     }
//   }, [selectedProject, dispatch]);

//   useEffect(() => {
//     if (selectedModule) {
//       dispatch(fetchTasksByModule(selectedModule));
//       fetchBugs();
//     }
//   }, [selectedModule, dispatch]);

//   // Handler functions remain the same
//   const handleProjectSelect = (projectId) => {
//     setSelectedProject(projectId);
//   };

//   const handleModuleSelect = (moduleId) => {
//     setSelectedModule(moduleId);
//     setSelectedBugs([]);
//     setShowBugDetails(null);
//   };

//   const fetchBugs = async () => {
//     if (!selectedModule) return;
    
//     try {
//       setBugsLoading(true);
//       console.log("Fetching bugs for module:", selectedModule);
//       const data = await fetchbugsByModuleId(selectedModule);
//       console.log("Received bugs data:", data);
//       setBugs(data);
//     } catch (error) {
//       console.error("Error fetching bugs:", error);
//     } finally {
//       setBugsLoading(false);
//     }
//   };

//   const toggleBugSelection = (bugId) => {
//     if (selectedBugs.includes(bugId)) {
//       setSelectedBugs(selectedBugs.filter(id => id !== bugId));
//     } else {
//       setSelectedBugs([...selectedBugs, bugId]);
//     }
//   };

//   const handleTaskSelect = (taskId) => {
//     setSelectedTask(taskId);
//   };

//   const handleDeveloperSelect = (developerId) => {
//     setSelectedDeveloper(developerId);
//   };

//   const assignBugsToDeveloper = async () => {
//     if (!selectedBugs.length || !selectedDeveloper || !selectedTask) {
//       alert("Please select bugs, a task, and a developer");
//       return;
//     }
  
//     try {
//       setAssignmentLoading(true);
//       const payload = {
//         bugs_ids: selectedBugs,
//         assigned_to: parseInt(selectedDeveloper),
//         fix_task: parseInt(selectedTask)
//       };
//       const response = await reassignBug(payload);
      
//       if (response && response.updated_bugs && response.updated_bugs.length > 0) {
//         alert(`Successfully assigned ${response.updated_bugs.length} bugs to developer`);
        
//         if (response.errors && response.errors.length > 0) {
//           console.error("Some bugs couldn't be assigned:", response.errors);
//           alert(`Note: ${response.errors.length} bugs couldn't be assigned. Check console for details.`);
//         }
        
//         fetchBugs();
        
//         setSelectedBugs([]);
//         setSelectedTask(null);
//         setSelectedDeveloper(null);
//       } else {
//         alert("No bugs were assigned. Please check console for details.");
//         console.error("Assignment response:", response);
//       }
//     } catch (error) {
//       console.error("Error assigning bugs:", error);
//       alert("Failed to assign bugs. Please try again.");
//     } finally {
//       setAssignmentLoading(false);
//     }
//   };

//   const filteredBugs = bugs.filter(bug => 
//     bug.bug_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     bug.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     bug.priority.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     // Reduced padding in main container
//     <div className="p-1">
//       {/* Reduced width and margin for search */}
//       <div className="relative w-64 mb-2">
//         <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
//         <input 
//           type="text" 
//           placeholder="Search bugs, projects, modules..." 
//           className="w-full p-1 pl-8 bg-white rounded border border-gray-200 text-xs"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Projects and Modules grid with reduced gap */}
//       <div className="grid grid-cols-2 gap-2 mb-2">
//         {/* Projects section with reduced padding and text size */}
//         <div className="bg-slate-100 rounded p-2">
//           <h2 className="text-sm font-semibold mb-2">Projects</h2>
          
//           {projectsLoading && <p className="text-xs text-gray-500">Loading projects...</p>}
//           {projectsError && <p className="text-xs text-red-500">{projectsError}</p>}
          
//           <div className="space-y-1">
//             {projects.length > 0 ? (
//               projects.map((project) => (
//                 <button
//                   key={project.id}
//                   className={`w-full text-xs font-medium text-left px-2 py-1 rounded transition ${
//                     selectedProject === project.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
//                   }`}
//                   onClick={() => handleProjectSelect(project.id)}
//                 >
//                   {project.project_name}
//                 </button>
//               ))
//             ) : !projectsLoading && (
//               <p className="text-xs text-gray-500">No projects available</p>
//             )}
//           </div>
//         </div>

//         {/* Modules section with reduced padding and text size */}
//         <div className="bg-slate-100 rounded p-2">
//           <h2 className="text-sm font-semibold mb-2">Modules</h2>
          
//           {modulesLoading ? (
//             <p className="text-xs text-gray-500">Loading modules...</p>
//           ) : modulesError ? (
//             <p className="text-xs text-red-500">{modulesError}</p>
//           ) : selectedProject ? (
//             <div className="space-y-1">
//               {modules.length > 0 ? (
//                 modules.map((module) => (
//                   <button
//                     key={module.id}
//                     className={`w-full text-left px-2 py-1 rounded transition ${
//                       selectedModule === module.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
//                     }`}
//                     onClick={() => handleModuleSelect(module.id)}
//                   >
//                     <div className="text-xs font-medium">{module.module_name}</div>
//                     <div className="text-xxs text-gray-500 truncate">{module.module_description}</div>
//                   </button>
//                 ))
//               ) : (
//                 <p className="text-xs text-gray-500">No modules available</p>
//               )}
//             </div>
//           ) : (
//             <p className="text-xs text-gray-500">Select a project first</p>
//           )}
//         </div>
//       </div>

//       {/* Main content grid with reduced gap */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//         {/* Bugs section with reduced padding */}
//         <div className="md:col-span-1">
//           <div className="bg-slate-100 rounded p-2">
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="text-sm font-semibold">Bugs</h2>
//               {selectedBugs.length > 0 && (
//                 <div className="text-xs text-blue-600">{selectedBugs.length} selected</div>
//               )}
//             </div>
            
//             {!selectedModule ? (
//               <p className="text-xs text-gray-500">Select a module to view bugs</p>
//             ) : bugsLoading ? (
//               <p className="text-xs text-gray-500">Loading bugs...</p>
//             ) : filteredBugs.length === 0 ? (
//               <p className="text-xs text-gray-500">No bugs found</p>
//             ) : (
//               <div className="space-y-1">
//                 {filteredBugs.map((bug) => (
//                   <div 
//                     key={bug.id}
//                     className={`border rounded p-2 ${
//                       selectedBugs.includes(bug.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                     } ${showBugDetails === bug.id ? 'bg-gray-50' : ''} cursor-pointer`}
//                     onClick={() => setShowBugDetails(showBugDetails === bug.id ? null : bug.id)}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-1 w-full">
//                         <button 
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleBugSelection(bug.id);
//                           }}
//                           className="mt-0.5 flex-shrink-0"
//                         >
//                           {selectedBugs.includes(bug.id) ? (
//                             <CheckCircle size={12} className="text-blue-600" />
//                           ) : (
//                             <Circle size={12} className="text-gray-400" />
//                           )}
//                         </button>
//                         <div className="flex-grow">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <div className="text-xs font-medium">{bug.bug_id}: {bug.title}</div>
//                               <div className="text-xxs text-gray-600 mt-0.5 truncate">{bug.description}</div>
//                             </div>
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setShowBugDetails(showBugDetails === bug.id ? null : bug.id);
//                               }}
//                               className="ml-1"
//                             >
//                               {showBugDetails === bug.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
//                             </button>
//                           </div>
//                           <div className="flex gap-1 mt-1">
//                             <span className={`px-1.5 py-0.5 rounded-full text-xxs ${
//                               bug.priority === 'High' || bug.priority === 'critical' ? 'bg-red-100 text-red-800' : 
//                               bug.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
//                               'bg-green-100 text-green-800'
//                             }`}>
//                               {bug.priority}
//                             </span>
//                             <span className={`px-1.5 py-0.5 rounded-full text-xxs ${
//                               bug.status === 'open' ? 'bg-blue-100 text-blue-800' : 
//                               bug.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : 
//                               'bg-green-100 text-green-800'
//                             }`}>
//                               {bug.status}
//                             </span>
//                           </div>
                          
//                           {showBugDetails === bug.id && (
//                             <div className="mt-2 pt-2 border-t border-gray-200">
//                               <h4 className="text-xs font-medium mb-0.5">Description</h4>
//                               <p className="text-xxs mb-1">{bug.description}</p>
                              
//                               <h4 className="text-xs font-medium mb-0.5">Steps to Reproduce</h4>
//                               <p className="text-xxs mb-1">{bug.steps_to_reproduce}</p>
                              
//                               <h4 className="text-xs font-medium mb-0.5">Environment</h4>
//                               <p className="text-xxs mb-1">{bug.environment}</p>
                              
//                               <h4 className="text-xs font-medium mb-0.5">Reported By</h4>
//                               <p className="text-xxs mb-1">{bug.reported_by.full_name}</p>
                              
//                               <h4 className="text-xs font-medium mb-0.5">Test Case Result</h4>
//                               <p className="text-xxs mb-1">
//                                 Result: <span className={`font-medium ${bug.test_case_result.result === 'failed' ? 'text-red-600' : 'text-green-600'}`}>
//                                   {bug.test_case_result.result}
//                                 </span>
//                                 <br />
//                                 Remarks: {bug.test_case_result.remarks}
//                               </p>
                              
//                               {bug.attachments && bug.attachments.length > 0 && (
//                                 <>
//                                   <h4 className="text-xs font-medium mb-0.5">Attachments</h4>
//                                   <div className="flex flex-wrap gap-1">
//                                     {bug.attachments.map(attachment => (
//                                       <a 
//                                         key={attachment.id}
//                                         href={attachment.file}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-blue-600 underline text-xxs"
//                                       >
//                                         View attachment
//                                       </a>
//                                     ))}
//                                   </div>
//                                 </>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tasks and Developer selection with reduced padding */}
//         <div className="md:col-span-2">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             {/* Tasks Section */}
//             <div className="bg-slate-100 rounded p-2">
//               <h2 className="text-sm font-semibold mb-2">Tasks for bug</h2>
              
//               {tasksLoading ? (
//                 <p className="text-xs text-gray-500">Loading tasks...</p>
//               ) : tasksError ? (
//                 <p className="text-xs text-red-500">{tasksError}</p>
//               ) : !selectedModule ? (
//                 <p className="text-xs text-gray-500">Select a module to view tasks</p>
//               ) : tasks.length === 0 ? (
//                 <p className="text-xs text-gray-500">No tasks available for this module</p>
//               ) : (
//                 <div className="space-y-1">
//                   {tasks.map((task) => (
//                     <button
//                       key={task.id}
//                       className={`w-full text-left px-2 py-1 rounded transition ${
//                         selectedTask === task.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
//                       }`}
//                       onClick={() => handleTaskSelect(task.id)}
//                     >
//                       <div className="text-xs font-medium">{task.task_name}</div>
//                       <div className="text-xxs text-gray-500 truncate">{task.task_description}</div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Developers Section */}
//             <div className="bg-slate-100 rounded p-2">
//               <h2 className="text-sm font-semibold mb-2">Developers</h2>
              
//               {developersLoading ? (
//                 <p className="text-xs text-gray-500">Loading developers...</p>
//               ) : !selectedProject ? (
//                 <p className="text-xs text-gray-500">Select a project to view developers</p>
//               ) : developers && developers.length === 0 ? (
//                 <p className="text-xs text-gray-500">No developers assigned to this project</p>
//               ) : (
//                 <div className="space-y-1">
//                   {developers && developers.map((developer) => (
//                     <button
//                       key={developer.id}
//                       className={`w-full text-left px-2 py-1 rounded transition ${
//                         selectedDeveloper === developer.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
//                       }`}
//                       onClick={() => handleDeveloperSelect(developer.id)}
//                     >
//                       <div className="text-xs font-medium">{developer.full_name}</div>
//                       <div className="text-xxs text-gray-500">{developer.email}</div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Assignment Section */}
//           <div className="bg-slate-100 rounded p-2 mt-2">
//             <h2 className="text-sm font-semibold mb-2">Assignment</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
//               <div>
//                 <h3 className="text-xs font-medium mb-1">Selected Bugs</h3>
//                 <div className="text-xs">
//                   {selectedBugs.length === 0 ? (
//                     <p className="text-xxs text-gray-500">No bugs selected</p>
//                   ) : (
//                     <div className="flex flex-wrap gap-1">
//                       {selectedBugs.map(bugId => {
//                         const bug = bugs.find(b => b.id === bugId);
//                         return bug ? (
//                           <div key={bugId} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xxs flex items-center">
//                             {bug.bug_id}
//                             <button 
//                               onClick={() => toggleBugSelection(bugId)}
//                               className="ml-1 text-blue-600 hover:text-blue-800"
//                             >
//                               <X size={10} />
//                             </button>
//                           </div>
//                         ) : null;
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-xs font-medium mb-1">Selected Task</h3>
//                 <div className="text-xs">
//                   {!selectedTask ? (
//                     <p className="text-xxs text-gray-500">No task selected</p>
//                   ) : (
//                     <div className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xxs inline-block">
//                       {tasks.find(t => t.id === selectedTask)?.title || selectedTask}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-xs font-medium mb-1">Selected Developer</h3>
//                 <div className="text-xs">
//                   {!selectedDeveloper ? (
//                     <p className="text-xxs text-gray-500">No developer selected</p>
//                   ) : (
//                     <div className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xxs inline-block">
//                       {developers?.find(d => d.id === selectedDeveloper)?.full_name || selectedDeveloper}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={assignBugsToDeveloper}
//               disabled={selectedBugs.length === 0 || !selectedTask || !selectedDeveloper || assignmentLoading}
//               className={`w-full py-1.5 rounded text-white text-xs font-medium ${
//                 selectedBugs.length === 0 || !selectedTask || !selectedDeveloper || assignmentLoading
//                   ? 'bg-gray-300 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//             >
//               {assignmentLoading ? 'Assigning...' : 'Assign Bugs to Developer'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BugAssignment;




import React, { useEffect, useState } from 'react';
import { getProjectByLead } from '../../../redux/slices/projectSlice';
import { fetchModules } from "../../../redux/slices/moduleSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Search, CheckCircle, Circle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchbugsByModuleId, reassignBug } from '../../../api/projectApi';
import { getDevelopersByProject } from "../../../redux/slices/developerSlice";
import { fetchTasksByModule } from "../../../redux/slices/taskSlice";

const BugAssignment = () => {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [bugsLoading, setBugsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [showBugDetails, setShowBugDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
  const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);
  const { developers, loading: developersLoading } = useSelector(state => state.developers);
  const tasksState = useSelector(state => state.tasks) || { tasks: [], loading: false, error: null };
  const { tasks = [], loading: tasksLoading, error: tasksError } = tasksState;

  useEffect(() => {
    dispatch(getProjectByLead());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchModules(selectedProject));
      dispatch(getDevelopersByProject(selectedProject));
      setSelectedModule(null);
      setBugs([]);
      setSelectedBugs([]);
      setSelectedTask(null);
      setSelectedDeveloper(null);
      setShowBugDetails(null);
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    if (selectedModule) {
      dispatch(fetchTasksByModule(selectedModule));
      fetchBugs();
    }
  }, [selectedModule, dispatch]);

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
    setSelectedBugs([]);
    setShowBugDetails(null);
  };

  const fetchBugs = async () => {
    if (!selectedModule) return;
    
    try {
      setBugsLoading(true);
      console.log("Fetching bugs for module:", selectedModule);
      const data = await fetchbugsByModuleId(selectedModule);
      console.log("Received bugs data:", data);
      setBugs(data);
    } catch (error) {
      console.error("Error fetching bugs:", error);
    } finally {
      setBugsLoading(false);
    }
  };

  const toggleBugSelection = (bugId) => {
    if (selectedBugs.includes(bugId)) {
      setSelectedBugs(selectedBugs.filter(id => id !== bugId));
    } else {
      setSelectedBugs([...selectedBugs, bugId]);
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTask(taskId);
  };

  const handleDeveloperSelect = (developerId) => {
    setSelectedDeveloper(developerId);
  };

  const assignBugsToDeveloper = async () => {
    if (!selectedBugs.length || !selectedDeveloper || !selectedTask) {
      alert("Please select bugs, a task, and a developer");
      return;
    }
  
    try {
      setAssignmentLoading(true);
      const payload = {
        bugs_ids: selectedBugs,
        assigned_to: parseInt(selectedDeveloper),
        fix_task: parseInt(selectedTask)
      };
      const response = await reassignBug(payload);
      
      if (response && response.updated_bugs && response.updated_bugs.length > 0) {
        alert(`Successfully assigned ${response.updated_bugs.length} bugs to developer`);
        
        if (response.errors && response.errors.length > 0) {
          console.error("Some bugs couldn't be assigned:", response.errors);
          alert(`Note: ${response.errors.length} bugs couldn't be assigned. Check console for details.`);
        }
        
        fetchBugs();
        
        setSelectedBugs([]);
        setSelectedTask(null);
        setSelectedDeveloper(null);
      } else {
        alert("No bugs were assigned. Please check console for details.");
        console.error("Assignment response:", response);
      }
    } catch (error) {
      console.error("Error assigning bugs:", error);
      alert("Failed to assign bugs. Please try again.");
    } finally {
      setAssignmentLoading(false);
    }
  };

  const filteredBugs = bugs.filter(bug => 
    bug.bug_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bug.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bug.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-2">
      {/* Search bar */}
      <div className="relative w-64 mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        <input 
          type="text" 
          placeholder="Search bugs, projects, modules..." 
          className="w-full p-2 pl-8 bg-white rounded border border-gray-200 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects and Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Projects section */}
        <div className="bg-slate-100 rounded p-3 h-full">
          <h2 className="text-sm font-semibold mb-2">Projects</h2>
          
          {projectsLoading && <p className="text-xs text-gray-500">Loading projects...</p>}
          {projectsError && <p className="text-xs text-red-500">{projectsError}</p>}
          
          <div className="space-y-1 overflow-y-auto max-h-32">
            {projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  className={`w-full text-xs font-medium text-left px-2 py-1 rounded transition ${
                    selectedProject === project.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <span className="block truncate">{project.project_name}</span>
                </button>
              ))
            ) : !projectsLoading && (
              <p className="text-xs text-gray-500">No projects available</p>
            )}
          </div>
        </div>

        {/* Modules section */}
        <div className="bg-slate-100 rounded p-3 h-full">
          <h2 className="text-sm font-semibold mb-2">Modules</h2>
          
          {modulesLoading ? (
            <p className="text-xs text-gray-500">Loading modules...</p>
          ) : modulesError ? (
            <p className="text-xs text-red-500">{modulesError}</p>
          ) : selectedProject ? (
            <div className="space-y-1 overflow-y-auto max-h-32">
              {modules.length > 0 ? (
                modules.map((module) => (
                  <button
                    key={module.id}
                    className={`w-full text-left px-2 py-1 rounded transition ${
                      selectedModule === module.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleModuleSelect(module.id)}
                  >
                    <div className="text-xs font-medium truncate">{module.module_name}</div>
                    <div className="text-xs text-gray-500 truncate">{module.module_description}</div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-500">No modules available</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Select a project first</p>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Bugs section */}
        <div className="md:col-span-1">
          <div className="bg-slate-100 rounded p-3 h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold">Bugs</h2>
              {selectedBugs.length > 0 && (
                <div className="text-xs text-blue-600">{selectedBugs.length} selected</div>
              )}
            </div>
            
            {!selectedModule ? (
              <p className="text-xs text-gray-500">Select a module to view bugs</p>
            ) : bugsLoading ? (
              <p className="text-xs text-gray-500">Loading bugs...</p>
            ) : filteredBugs.length === 0 ? (
              <p className="text-xs text-gray-500">No bugs found</p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-96">
                {filteredBugs.map((bug) => (
                  <div 
                    key={bug.id}
                    className={`border rounded p-2 ${
                      selectedBugs.includes(bug.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${showBugDetails === bug.id ? 'bg-gray-50' : ''} cursor-pointer`}
                    onClick={() => setShowBugDetails(showBugDetails === bug.id ? null : bug.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-1 w-full">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBugSelection(bug.id);
                          }}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {selectedBugs.includes(bug.id) ? (
                            <CheckCircle size={14} className="text-blue-600" />
                          ) : (
                            <Circle size={14} className="text-gray-400" />
                          )}
                        </button>
                        <div className="flex-grow min-w-0"> {/* Added min-width to handle text overflow */}
                          <div className="flex justify-between items-start">
                            <div className="flex-grow min-w-0 mr-1"> {/* Added min-width and margin */}
                              <div className="text-xs font-medium truncate">{bug.bug_id}: {bug.title}</div>
                              <div className="text-xs text-gray-600 mt-0.5 truncate">{bug.description}</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowBugDetails(showBugDetails === bug.id ? null : bug.id);
                              }}
                              className="flex-shrink-0 ml-1"
                            >
                              {showBugDetails === bug.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                              bug.priority === 'High' || bug.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                              bug.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {bug.priority}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                              bug.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                              bug.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {bug.status}
                            </span>
                          </div>
                          
                          {showBugDetails === bug.id && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <h4 className="text-xs font-medium mb-1">Description</h4>
                              <p className="text-xs mb-2 break-words">{bug.description}</p>
                              
                              <h4 className="text-xs font-medium mb-1">Steps to Reproduce</h4>
                              <p className="text-xs mb-2 break-words">{bug.steps_to_reproduce}</p>
                              
                              <h4 className="text-xs font-medium mb-1">Environment</h4>
                              <p className="text-xs mb-2 break-words">{bug.environment}</p>
                              
                              <h4 className="text-xs font-medium mb-1">Reported By</h4>
                              <p className="text-xs mb-2">{bug.reported_by.full_name}</p>
                              
                              <h4 className="text-xs font-medium mb-1">Test Case Result</h4>
                              <p className="text-xs mb-2">
                                Result: <span className={`font-medium ${bug.test_case_result.result === 'failed' ? 'text-red-600' : 'text-green-600'}`}>
                                  {bug.test_case_result.result}
                                </span>
                                <br />
                                Remarks: {bug.test_case_result.remarks}
                              </p>
                              
                              {bug.attachments && bug.attachments.length > 0 && (
                                <>
                                  <h4 className="text-xs font-medium mb-1">Attachments</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {bug.attachments.map(attachment => (
                                      <a 
                                        key={attachment.id}
                                        href={attachment.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-xs"
                                      >
                                        View attachment
                                      </a>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tasks and Developer selection */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tasks Section */}
            <div className="bg-slate-100 rounded p-3 h-full">
              <h2 className="text-sm font-semibold mb-2">Tasks for bug</h2>
              
              {tasksLoading ? (
                <p className="text-xs text-gray-500">Loading tasks...</p>
              ) : tasksError ? (
                <p className="text-xs text-red-500">{tasksError}</p>
              ) : !selectedModule ? (
                <p className="text-xs text-gray-500">Select a module to view tasks</p>
              ) : tasks.length === 0 ? (
                <p className="text-xs text-gray-500">No tasks available for this module</p>
              ) : (
                <div className="space-y-1 overflow-y-auto max-h-40">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      className={`w-full text-left px-2 py-1 rounded transition ${
                        selectedTask === task.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleTaskSelect(task.id)}
                    >
                      <div className="text-xs font-medium truncate">{task.task_name}</div>
                      <div className="text-xs text-gray-500 truncate">{task.task_description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Developers Section */}
            <div className="bg-slate-100 rounded p-3 h-full">
              <h2 className="text-sm font-semibold mb-2">Developers</h2>
              
              {developersLoading ? (
                <p className="text-xs text-gray-500">Loading developers...</p>
              ) : !selectedProject ? (
                <p className="text-xs text-gray-500">Select a project to view developers</p>
              ) : developers && developers.length === 0 ? (
                <p className="text-xs text-gray-500">No developers assigned to this project</p>
              ) : (
                <div className="space-y-1 overflow-y-auto max-h-40">
                  {developers && developers.map((developer) => (
                    <button
                      key={developer.id}
                      className={`w-full text-left px-2 py-1 rounded transition ${
                        selectedDeveloper === developer.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleDeveloperSelect(developer.id)}
                    >
                      <div className="text-xs font-medium truncate">{developer.full_name}</div>
                      <div className="text-xs text-gray-500 truncate">{developer.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignment Section */}
          <div className="bg-slate-100 rounded p-3 mt-3">
            <h2 className="text-sm font-semibold mb-2">Assignment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <h3 className="text-xs font-medium mb-1">Selected Bugs</h3>
                <div>
                  {selectedBugs.length === 0 ? (
                    <p className="text-xs text-gray-500">No bugs selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto p-1">
                      {selectedBugs.map(bugId => {
                        const bug = bugs.find(b => b.id === bugId);
                        return bug ? (
                          <div key={bugId} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs flex items-center">
                            <span className="truncate max-w-16">{bug.bug_id}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBugSelection(bugId);
                              }}
                              className="ml-1 text-blue-600 hover:text-blue-800 flex-shrink-0"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium mb-1">Selected Task</h3>
                <div>
                  {!selectedTask ? (
                    <p className="text-xs text-gray-500">No task selected</p>
                  ) : (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs inline-block max-w-full">
                      <span className="truncate block">{tasks.find(t => t.id === selectedTask)?.task_name || selectedTask}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium mb-1">Selected Developer</h3>
                <div>
                  {!selectedDeveloper ? (
                    <p className="text-xs text-gray-500">No developer selected</p>
                  ) : (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs inline-block max-w-full">
                      <span className="truncate block">{developers?.find(d => d.id === selectedDeveloper)?.full_name || selectedDeveloper}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={assignBugsToDeveloper}
              disabled={selectedBugs.length === 0 || !selectedTask || !selectedDeveloper || assignmentLoading}
              className={`w-full py-2 rounded text-white text-xs font-medium ${
                selectedBugs.length === 0 || !selectedTask || !selectedDeveloper || assignmentLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {assignmentLoading ? 'Assigning...' : 'Assign Bugs to Developer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugAssignment;