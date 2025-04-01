import React, { useEffect, useState } from 'react';
import { getProjectByQa } from '../../../redux/slices/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules } from '../../../redux/slices/moduleSlice';
import { getBugDetails, getFailedTestCases, getTestCaseBugs } from '../../../api/testApi';
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

  // Add file attachment handler
  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxSize);
    setAttachmentFiles(prev => [...prev, ...validFiles]);
  };

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(getProjectByQa());
  }, [dispatch]);  

  // Fetch modules when a project is selected
  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchModules(selectedProject));
      setSelectedModule(null);
      setSelectedTestCase(null);
      setSelectedBug(null);
      setBugs([]);
    }
  }, [selectedProject, dispatch]);

  // Fetch failed test cases when a module is selected
  useEffect(() => {
    if (selectedModule) {
      fetchFailedTestCases(selectedModule);
      setSelectedTestCase(null);
      setSelectedBug(null);
      setBugs([]);
    }
  }, [selectedModule]);

  // Fetch bugs when a test case is selected
  useEffect(() => {
    if (selectedTestCase) {
      fetchBugsForTestCase(selectedTestCase);
      setSelectedBug(null);
    }
  }, [selectedTestCase]);

  // Function to fetch failed test cases for a module
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

  // Function to fetch bugs for a test case
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

  // Handlers
  const handleProjectSelect = (projectId) => setSelectedProject(projectId);
  const handleModuleSelect = (moduleId) => setSelectedModule(moduleId);
  const handleTestCaseSelect = (testCaseId) => {
    setSelectedTestCase(testCaseId);
    setNewBug({...newBug, testCaseId});
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
    
    try {
      const formData = new FormData();
      
      // Create the bug object with the structure the backend expects
      const bugData = {
        bug_id: newBug.bugId || `BUG-${Date.now()}`, 
        title: newBug.title,
        description: newBug.description,
        priority: newBug.priority.toLowerCase(),
        severity: newBug.severity.toLowerCase(),
        steps_to_reproduce: newBug.stepsToReproduce,
        environment: newBug.environmentInfo
      };
  
      // Add bug data with the key "bug" as expected by the backend
      formData.append('bug', JSON.stringify(bugData));
      
      // Add remarks separately
      formData.append('remarks', newBug.description);
      
      // Add attachments
      attachmentFiles.forEach((file) => {
        formData.append('attachment', file);
      });
      
      // Use your existing ReportBug API function
      const reportedBug = await ReportBug(selectedTestCase, formData);
      
      setBugs(prevBugs => [...prevBugs, reportedBug]);
      
      // Reset the form
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
    }
  };

  // Helper functions for UI display
  const getFailedTestCasesByModuleId = () => testCases.filter(t => t.status === 'Failed' || t.status === 'failed');
  const getTestCaseById = (testCaseId) => testCases.find(t => t.id === testCaseId);
  
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

  return (
    <div className="p-4">
    <div className="relative w-72 mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search Test Cases..." className="w-full p-2 pl-10 bg-white rounded-md text-sm" />
          </div>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {/* Left Panel: Projects and Modules */}
        <div className="col-span-1 bg-slate-200 p-4 rounded-lg shadow-md">
          <h2 className="text-base font-semibold mb-3">Projects</h2>
          {projectsLoading && <p className="text-sm text-gray-500">Loading projects...</p>}
          {projectsError && <p className="text-sm text-red-500">{projectsError}</p>}
          <div className="space-y-2">
            {projects?.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedProject === project.id ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
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

        {/* Module panel */}
        <div className="col-span-1 bg-slate-200 p-4 rounded-lg shadow-md">
          <h2 className="text-base font-semibold mb-3">Modules</h2>
          <div className="space-y-2">
          {modulesLoading ? (
            <p className="text-sm text-gray-500">Loading modules...</p>
          ) : modulesError ? (
            <p className="text-sm text-red-500">{modulesError}</p>
          ) : selectedProject ? (
            <div className="space-y-2">
              {modules?.length > 0 ? (
                modules.map((module) => (
                  <button
                    key={module.id}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedModule === module.id ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleModuleSelect(module.id)}
                  >
                    <div className="font-medium text-sm">{module.module_name}</div>
                    <div className="text-xs text-gray-500 truncate mt-1">{module.module_description}</div>
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
        
        {/* Middle Panel: Failed Test Cases */}
        <div className="col-span-1 bg-slate-200 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold mb-3">Failed Test Cases</h2>
          </div>
          
          {loadingTestCases ? (
            <p className="text-sm text-gray-500">Loading test cases...</p>
          ) : errorTestCases ? (
            <p className="text-sm text-red-500">{errorTestCases}</p>
          ) : selectedModule ? (
            <div className="space-y-2">
              {getFailedTestCasesByModuleId().length > 0 ? (
                getFailedTestCasesByModuleId().map(testCase => (
                  <div 
                    key={testCase.id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedTestCase === testCase.id ? 'bg-red-50 border-red-300' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleTestCaseSelect(testCase.id)}
                  >
                    <div className="font-medium text-sm">{testCase.test_title || testCase.name}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                        Failed
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No failed test cases in this module</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a module to view failed test cases</p>
          )}
        </div>
        
        {/* Right Panel: Bug Details */}
        <div className="col-span-3 bg-slate-200 p-4 rounded-lg shadow-md">
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
              <div className="flex justify-between  items-center mb-4">
                <h2 className="text-base font-semibold mb-3">
                  Bugs for: {getTestCaseById(selectedTestCase)?.title || getTestCaseById(selectedTestCase)?.name}
                </h2>
                <button 
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                  onClick={() => setIsAddingBug(true)}
                >
                  Report New Bug
                </button>
              </div>
              
              {loadingBugs ? (
                <p className="text-sm text-gray-500">Loading bugs...</p>
              ) : errorBugs ? (
                <p className="text-sm text-red-500">{errorBugs}</p>
              ) : (
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
                <p className="text-sm text-gray-500">Select a failed test case to view or report bugs</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugManagement;