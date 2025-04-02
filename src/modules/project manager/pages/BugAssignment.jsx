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

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(getProjectByLead());
  }, [dispatch]);

  // Fetch modules when a project is selected
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

  // Fetch tasks when a module is selected
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
      const data = await fetchbugsByModuleId(selectedModule);
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
      bugs_ids: selectedBugs,                // Keep as array
      assigned_to: parseInt(selectedDeveloper), // Convert to number, not array
      fix_task: parseInt(selectedTask)       // Convert to number, not array
    };
    const response = await reassignBug(payload) 
    
    
    if (response && response.updated_bugs && response.updated_bugs.length > 0) {
      // Show success message
      alert(`Successfully assigned ${response.updated_bugs.length} bugs to developer`);
      
      // If there are errors, show them
      if (response.errors && response.errors.length > 0) {
        console.error("Some bugs couldn't be assigned:", response.errors);
        alert(`Note: ${response.errors.length} bugs couldn't be assigned. Check console for details.`);
      }
      
      // Refresh the bug list
      fetchBugs();
      
      // Reset selections
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
      setAssignmentLoading(false);  }
};

  const filteredBugs = bugs.filter(bug => 
    bug.bug_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bug.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bug.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="relative w-80 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Search bugs, projects, modules..." 
          className="w-full p-2 pl-10 bg-white rounded-lg border border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Projects and Modules */}
        <div className="col-span-1">
          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Projects</h2>
            
            {projectsLoading && <p className="text-sm text-gray-500">Loading projects...</p>}
            {projectsError && <p className="text-sm text-red-500">{projectsError}</p>}
            
            <div className="space-y-2">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    className={`w-full font-medium text-left px-3 py-2 rounded-md transition ${
                      selectedProject === project.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    {project.project_name}
                  </button>
                ))
              ) : !projectsLoading && (
                <p className="text-sm text-gray-500">No projects available</p>
              )}
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Modules</h2>
            
            {modulesLoading ? (
              <p className="text-sm text-gray-500">Loading modules...</p>
            ) : modulesError ? (
              <p className="text-sm text-red-500">{modulesError}</p>
            ) : selectedProject ? (
              <div className="space-y-2">
                {modules.length > 0 ? (
                  modules.map((module) => (
                    <button
                      key={module.id}
                      className={`w-full text-left px-3 py-2 rounded-md transition ${
                        selectedModule === module.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleModuleSelect(module.id)}
                    >
                      <div className="font-medium">{module.module_name}</div>
                      <div className="text-xs text-gray-500 truncate">{module.module_description}</div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No modules available</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select a project first</p>
            )}
          </div>
        </div>

        {/* Middle Column: Bug List */}
        <div className="col-span-1">
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Bugs</h2>
              {selectedBugs.length > 0 && (
                <div className="text-sm text-blue-600">{selectedBugs.length} selected</div>
              )}
            </div>
            
            {!selectedModule ? (
              <p className="text-sm text-gray-500">Select a module to view bugs</p>
            ) : bugsLoading ? (
              <p className="text-sm text-gray-500">Loading bugs...</p>
            ) : filteredBugs.length === 0 ? (
              <p className="text-sm text-gray-500">No bugs found</p>
            ) : (
              <div className="space-y-2">
                {filteredBugs.map((bug) => (
                  <div 
                    key={bug.id}
                    className={`border rounded-md p-3 ${
                      selectedBugs.includes(bug.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${showBugDetails === bug.id ? 'bg-gray-50' : ''} cursor-pointer`}
                    onClick={() => setShowBugDetails(showBugDetails === bug.id ? null : bug.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 w-full">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBugSelection(bug.id);
                          }}
                          className="mt-1 flex-shrink-0"
                        >
                          {selectedBugs.includes(bug.id) ? (
                            <CheckCircle size={16} className="text-blue-600" />
                          ) : (
                            <Circle size={16} className="text-gray-400" />
                          )}
                        </button>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{bug.bug_id}: {bug.title}</div>
                              <div className="text-sm text-gray-600 mt-1 truncate">{bug.description}</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowBugDetails(showBugDetails === bug.id ? null : bug.id);
                              }}
                              className="ml-2"
                            >
                              {showBugDetails === bug.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              bug.priority === 'High' || bug.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                              bug.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {bug.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              bug.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                              bug.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {bug.status}
                            </span>
                          </div>
                          
                          {showBugDetails === bug.id && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <h4 className="font-medium text-sm mb-1">Description</h4>
                              <p className="text-sm mb-2">{bug.description}</p>
                              
                              <h4 className="font-medium text-sm mb-1">Steps to Reproduce</h4>
                              <p className="text-sm mb-2">{bug.steps_to_reproduce}</p>
                              
                              <h4 className="font-medium text-sm mb-1">Environment</h4>
                              <p className="text-sm mb-2">{bug.environment}</p>
                              
                              <h4 className="font-medium text-sm mb-1">Reported By</h4>
                              <p className="text-sm mb-2">{bug.reported_by.full_name}</p>
                              
                              <h4 className="font-medium text-sm mb-1">Test Case Result</h4>
                              <p className="text-sm mb-2">
                                Result: <span className={`font-medium ${bug.test_case_result.result === 'failed' ? 'text-red-600' : 'text-green-600'}`}>
                                  {bug.test_case_result.result}
                                </span>
                                <br />
                                Remarks: {bug.test_case_result.remarks}
                              </p>
                              
                              {bug.attachments && bug.attachments.length > 0 && (
                                <>
                                  <h4 className="font-medium text-sm mb-1">Attachments</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {bug.attachments.map(attachment => (
                                      <a 
                                        key={attachment.id}
                                        href={attachment.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-sm"
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

        {/* Right Column: Tasks, Developers, and Assignment */}
        <div className="col-span-1">
          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Tasks for bug</h2>
            
            {tasksLoading ? (
              <p className="text-sm text-gray-500">Loading tasks...</p>
            ) : tasksError ? (
              <p className="text-sm text-red-500">{tasksError}</p>
            ) : !selectedModule ? (
              <p className="text-sm text-gray-500">Select a module to view tasks</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks available for this module</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${
                      selectedTask === task.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleTaskSelect(task.id)}
                  >
                    <div className="font-medium">{task.task_name}</div>
                    <div className="text-xs text-gray-500 truncate">{task.task_description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-100 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Developers</h2>
            
            {developersLoading ? (
              <p className="text-sm text-gray-500">Loading developers...</p>
            ) : !selectedProject ? (
              <p className="text-sm text-gray-500">Select a project to view developers</p>
            ) : developers && developers.length === 0 ? (
              <p className="text-sm text-gray-500">No developers assigned to this project</p>
            ) : (
              <div className="space-y-2">
                {developers && developers.map((developer) => (
                  <button
                    key={developer.id}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${
                      selectedDeveloper === developer.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleDeveloperSelect(developer.id)}
                  >
                    <div className="font-medium">{developer.full_name}</div>
                    <div className="text-xs text-gray-500">{developer.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Assignment</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Bugs</h3>
              <div className="text-sm">
                {selectedBugs.length === 0 ? (
                  <p className="text-gray-500">No bugs selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedBugs.map(bugId => {
                      const bug = bugs.find(b => b.id === bugId);
                      return bug ? (
                        <div key={bugId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                          {bug.bug_id}
                          <button 
                            onClick={() => toggleBugSelection(bugId)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
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

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Task</h3>
              <div className="text-sm">
                {!selectedTask ? (
                  <p className="text-gray-500">No task selected</p>
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs inline-block">
                    {tasks.find(t => t.id === selectedTask)?.title || selectedTask}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Developer</h3>
              <div className="text-sm">
                {!selectedDeveloper ? (
                  <p className="text-gray-500">No developer selected</p>
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs inline-block">
                    {developers?.find(d => d.id === selectedDeveloper)?.full_name || selectedDeveloper}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={assignBugsToDeveloper}
              disabled={selectedBugs.length === 0 || !selectedTask || !selectedDeveloper || assignmentLoading}
              className={`w-full py-2 rounded-md text-white font-medium ${
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