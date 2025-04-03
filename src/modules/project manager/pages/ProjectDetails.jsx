



import { ChevronLeft, UsersIcon, FolderIcon, CalendarIcon, BarChart2Icon, ClipboardListIcon, BugIcon } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewProject } from "../../../api/projectApi";
import { fetchTasksByModule } from '../../../redux/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BugByModule } from '../../../api/bugApi';
import { fetchTestByModule } from '../../../api/testApi';
import { inviteUser } from '../../../api/userApi';


const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [bugsLoading, setBugsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await viewProject(projectId);
        setProject(response.data);
        // Set the first module as selected by default if available
        if (response.data.modules && response.data.modules.length > 0) {
          setSelectedModuleId(response.data.modules[0].id);
        }
      } catch (err) {
        setError(err.message || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchModuleData(selectedModuleId);
    }
  }, [selectedModuleId]);

  const fetchModuleData = async (moduleId) => {
    if (!moduleId) return;
    
    // Fetch tasks via Redux action
    dispatch(fetchTasksByModule(moduleId));
    
    // Fetch test cases
    setTestsLoading(true);
    try {
      const testsData = await fetchTestByModule(moduleId);
      setTestCases(testsData);
    } catch (err) {
      console.error("Error fetching test cases:", err);
    } finally {
      setTestsLoading(false);
    }
    
    // Fetch bugs
    setBugsLoading(true);
    try {
      const bugsData = await BugByModule(moduleId);
      setBugs(bugsData);
    } catch (err) {
      console.error("Error fetching bugs:", err);
    } finally {
      setBugsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/projectmanager_dashboard/project_management");
  };

  const handleModuleClick = (moduleId) => {
    setSelectedModuleId(moduleId);
    setActiveTab('tasks'); // Reset to tasks tab when a new module is selected
  };

  // Find the currently selected module
  const selectedModule = project?.modules?.find(module => module.id === selectedModuleId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-50';
      case 'completed': return 'text-green-500 bg-green-50';
      case 'in-progress': return 'text-blue-500 bg-blue-50';
      case 'failed': return 'text-red-500 bg-red-50';
      case 'not_run': return 'text-gray-500 bg-gray-50';
      case 'pass': return 'text-green-500 bg-green-50';
      case 'fail': return 'text-red-500 bg-red-50';
      case 'assigned': return 'text-purple-500 bg-purple-50';
      case 'open': return 'text-orange-500 bg-orange-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'major': return 'text-red-500 bg-red-50';
      case 'minor': return 'text-yellow-500 bg-yellow-50';
      case 'trivial': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-1 md:p-3">
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-2 transition-colors"
      >
        <ChevronLeft size={14} />
        <span className="text-sm">Back to Projects</span>
      </button>

      {project ? (
        <div className="grid md:grid-cols-3 gap-2">
          {/* Project Overview */}
          <div className="md:col-span-2 bg-white rounded-lg p-4 space-y-2">
            <h2 className="text-xl font-bold text-gray-800">{project.project_name}</h2>
            <p className="text-gray-600 text-sm">{project.project_description}</p>

            <div className="grid md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="text-gray-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="font-semibold text-sm">{project.deadline}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <BarChart2Icon className="text-gray-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold">{project.progress}%</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Project Team */}
          <div className="bg-slate-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <UsersIcon className="mr-1 text-gray-500" size={18} />
              <h3 className="text-sm font-semibold text-gray-800">Project Team</h3>
            </div>

            {/* Project Lead */}
            <div className="flex items-center space-y-1 mb-2">
              <img
                src={project.project_lead.profile_picture || "/default.svg"}
                alt={project.project_lead.name}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{project.project_lead.name}</p>
                <p className="text-xs text-gray-500">{project.project_lead.role}</p>
              </div>
            </div>

            {/* Team Members */}
            <div className=" items-center space-x-2 mb-2">
              {project.project_team.map((member) => (
                <div key={member.id} className="flex items-center space-x-2  p-2 rounded-lg">
                  <img
                    src={member.user_details.profile_picture || "/default.svg"}
                    alt={member.user_details.name}
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-800">{member.user_details.name}</p>
                    <p className="text-xs text-gray-500">{member.user_details.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Tabs - Replacement for clickable list */}
          <div className="md:col-span-3 bg-white rounded-lg p-4 mt-2">
            <div className="flex items-center mb-4">
              <FolderIcon className="mr-1 text-gray-500" size={18} />
              <h3 className="text-base font-semibold text-gray-800">Project Modules</h3>
            </div>
            
            {/* Tabs for Module Selection */}
            <div className="border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px">
                {project.modules.map((module) => (
                  <li key={module.id} className="mr-2">
                    <button
                      onClick={() => handleModuleClick(module.id)}
                      className={`inline-flex items-center px-4 py-2 border-b-2 rounded-t-lg text-sm font-medium transition-colors ${
                        selectedModuleId === module.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span>{module.module_name}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium 
                        ${module.priority === 'high' ? 'bg-red-100 text-red-800' :
                          module.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                        {module.priority}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Selected Module Details - Only shown when a module is selected */}
          {selectedModule && (
            <div className="md:col-span-3 bg-blue-100 p-4 rounded-lg border border-blue-300 mt-2">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-gray-800">Selected: {selectedModule.module_name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                  ${selectedModule.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedModule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                  {selectedModule.priority}
                </span>
              </div>
              <div className="bg-white p-4 rounded-md border border-blue-200">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Module Description:</h5>
                <p className="text-sm text-gray-700">{selectedModule.module_description}</p>
              </div>
            </div>
          )}

          {/* Module Details Tabs */}
          {selectedModuleId && (
            <div className="md:col-span-3 bg-white rounded-lg p-4 mt-2">
              <div className="border-b border-gray-200 mb-2">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <button
                      className={`inline-flex items-center px-3 py-1.5 border-b-2 rounded-t-lg text-sm ${
                        activeTab === 'tasks'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab('tasks')}
                    >
                      <FolderIcon className="w-4 h-4 mr-1" />
                      Tasks
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={`inline-flex items-center px-3 py-1.5 border-b-2 rounded-t-lg text-sm ${
                        activeTab === 'testcases'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab('testcases')}
                    >
                      <ClipboardListIcon className="w-4 h-4 mr-1" />
                      Test Cases
                    </button>
                  </li>
                  <li>
                    <button
                      className={`inline-flex items-center px-3 py-1.5 border-b-2 rounded-t-lg text-sm ${
                        activeTab === 'bugs'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab('bugs')}
                    >
                      <BugIcon className="w-4 h-4 mr-1" />
                      Bugs
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tasks Tab Content */}
              {activeTab === 'tasks' && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Tasks</h3>
                  {tasksLoading ? (
                    <p className="text-gray-500 text-sm">Loading tasks...</p>
                  ) : tasks.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-2">
                      {tasks.map((task) => (
                        <div key={task.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-gray-800">{task.task_name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs my-1">{task.task_description}</p>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <p className="text-xs text-gray-500"><strong>Assigned To:</strong> {task.assigned_to_name}</p>
                            {task.due_date && (
                              <p className="text-xs text-gray-500"><strong>Due Date:</strong> {task.due_date}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No tasks available for this module.</p>
                  )}
                </div>
              )}

              {/* Test Cases Tab Content */}
              {activeTab === 'testcases' && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Test Cases</h3>
                  {testsLoading ? (
                    <p className="text-gray-500 text-sm">Loading test cases...</p>
                  ) : testCases.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-2">
                      {testCases.map((test) => (
                        <div key={test.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-gray-800">{test.test_title}</h4>
                            <div className="flex space-x-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                {test.status}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                                {test.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs my-1">{test.test_description}</p>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <p className="text-xs text-gray-500"><strong>ID:</strong> {test.test_id}</p>
                            {test.assigned_users && test.assigned_users.length > 0 && (
                              <p className="text-xs text-gray-500">
                                <strong>Assigned To:</strong> {test.assigned_users.map(user => user.username).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No test cases available for this module.</p>
                  )}
                </div>
              )}

              {/* Bugs Tab Content */}
              {activeTab === 'bugs' && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Bugs</h3>
                  {bugsLoading ? (
                    <p className="text-gray-500 text-sm">Loading bugs...</p>
                  ) : bugs.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-2">
                      {bugs.map((bug) => (
                        <div key={bug.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-gray-800">{bug.title}</h4>
                            <div className="flex space-x-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                                {bug.status}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                                {bug.priority}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                                {bug.severity}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs my-1">{bug.description}</p>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <p className="text-xs text-gray-500"><strong>ID:</strong> {bug.bug_id}</p>
                            <p className="text-xs text-gray-500"><strong>Reported By:</strong> {bug.reported_by.full_name}</p>
                            <p className="text-xs text-gray-500"><strong>Environment:</strong> {bug.environment}</p>
                            <p className="text-xs text-gray-500">
                              <strong>Reported On:</strong> {new Date(bug.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No bugs reported for this module.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Message when no module is selected */}
          {!selectedModuleId && (
            <div className="md:col-span-3 bg-gray-50 rounded-lg p-6 mt-2 text-center">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No module selected</h3>
              <p className="mt-1 text-sm text-gray-500">Please select a module from the tabs above to view details, tasks, test cases, and bugs.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-4 bg-white rounded-lg">
          {loading ? (
            <p className="text-gray-500">Loading project details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-500">No project details found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;












