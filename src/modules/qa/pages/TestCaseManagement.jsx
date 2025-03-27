import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectByQa } from '../../../redux/slices/projectSlice';
import { fetchCompletedModules } from '../../../redux/slices/moduleSlice';
import { fetchTestCases } from '../../../redux/slices/testCaseSlice';
import { addTestByModuleId, addTestType, fetchTestEngineers, fetchTestTypes } from '../../../api/projectApi';
import { FiMoreHorizontal } from "react-icons/fi"


const TestCaseManagement = () => {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isAddingTestCase, setIsAddingTestCase] = useState(false);
  
  const [newTestType, setNewTestType] = useState(""); 
  const [testTypes, setTestTypes] = useState([]);
  const [testEngineers, setTestEngineers] = useState([]);


  const initialTestCaseState = { 
    test_id: '',  
    test_title: '', 
    test_description: '', 
    priority: 'medium',
    precondition: '',
    postcondition: '',
    test_type: '',
    due_date: '',
    assignedUsers: [],
    test_steps: [
      { step_number: 1, step_description: '', expected_result: '', status: 'not_run' }
    ]
  };
  
  const [newTestCase, setNewTestCase] = useState(initialTestCaseState);
  const [testSteps, setTestSteps] = useState([{ step_number: 1, step_description: '', expected_result: '', status: 'not_run' }]);

  const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
  
  const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);
  
  const { tests, loading: testsLoading, error: testsError } = useSelector(state => state.tests);
  
  const { developers, loading: developersLoading } = useSelector(state => state.developers || { developers: [], loading: false });

  useEffect(() => {
    dispatch(getProjectByQa());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchCompletedModules(selectedProject));

      const loadTestEngineers = async () => {
        try {
          const engineers = await fetchTestEngineers(selectedProject);
          setTestEngineers(engineers);
        } catch (error) {
          console.error("Error fetching test engineers", error);
        }
      };
      loadTestEngineers();
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    if (selectedModule) {
      dispatch(fetchTestCases(selectedModule));
    }
  }, [selectedModule, dispatch]);


  useEffect(() => {
    const loadTestTypes = async () => {
      try {
        const types = await fetchTestTypes();
        setTestTypes(types);
        if (types.length > 0) {
          setNewTestCase(prev => ({ ...prev, test_type: types[0].id }));
        }
      } catch (error) {
        console.error("Error fetching test types", error);
      }
    };
    loadTestTypes();
  }, []);


  

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setSelectedModule(null);
  };

  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
  };

  const addTestStep = () => {
    const newStep = {
      step_number: testSteps.length + 1,
      step_description: '',
      expected_result: '',
      status: 'not_run'
    };
    setTestSteps([...testSteps, newStep]);
  };

  const removeTestStep = (index) => {
    if (testSteps.length > 1) {
      const updatedSteps = testSteps.filter((_, i) => i !== index);
      const renumberedSteps = updatedSteps.map((step, i) => ({
        ...step,
        step_number: i + 1
      }));
      setTestSteps(renumberedSteps);
    }
  };

  const handleTestStepChange = (index, field, value) => {
    const updatedSteps = [...testSteps];
    updatedSteps[index][field] = value;
    setTestSteps(updatedSteps);
  };

  const handleAddTestCase = async () => {
    if (!newTestCase.test_id.trim() || !newTestCase.test_title.trim()) {
      alert("Test ID and Title are required!");
      return;
    }

    const testCaseData = {
      test_id: newTestCase.test_id,
      test_title: newTestCase.test_title,
      test_description: newTestCase.test_description,
      priority: newTestCase.priority,
      precondition: newTestCase.precondition,
      postcondition: newTestCase.postcondition,
      test_type: newTestCase.test_type,
      due_date: newTestCase.due_date,
      assigned_users: newTestCase.assignedUsers,
      status: newTestCase.status,
      test_steps: testSteps 
    };

    try {
      await addTestByModuleId(selectedModule, testCaseData);
      
      alert("Test case added successfully!");
      
      setNewTestCase(initialTestCaseState);
      setTestSteps([{ step_number: 1, step_description: '', expected_result: '', status: 'not_run' }]);
      setIsAddingTestCase(false);
      
      dispatch(fetchTestCases(selectedModule));
    } catch (error) {
      console.error("Failed to add test case:", error.response?.data || error.message);
      alert("Failed to add test case: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleUserSelect = (userId) => {
    const isSelected = newTestCase.assignedUsers.includes(userId);
    if (isSelected) {
      setNewTestCase(prev => ({
        ...prev,
        assignedUsers: prev.assignedUsers.filter(id => id !== userId)
      }));
    } else {
      setNewTestCase(prev => ({
        ...prev,
        assignedUsers: [...prev.assignedUsers, userId]
      }));
    }
  };
  
  const handleCancelTestCaseForm = () => {
    setNewTestCase(initialTestCaseState);
    setTestSteps([{ step_number: 1, step_description: '', expected_result: '', status: 'not_run' }]);
    setIsAddingTestCase(false);
  };


  const handleAddTestType = async () => {
    if (!newTestType.trim()) {
      alert("Test type name cannot be empty!");
      return;
    }
    try {
      await addTestType(newTestType); 
      setNewTestType(""); 
      
      const updatedTypes = await fetchTestTypes();
      setTestTypes(updatedTypes); 
      
      alert("Test type added successfully!");
    } catch (error) {
      console.error("Error adding test type:", error.response?.data || error);
      alert("Failed to add test type. " + (error.response?.data?.name?.[0] || ""));
    }
  };
  

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateStatusBadgeClass = (dueStatus) => {
    if (!dueStatus) return 'bg-gray-100 text-gray-800';
    
    if (dueStatus.includes('overdue') || dueStatus.includes('ago')) {
      return 'bg-red-100 text-red-800';
    } else if (dueStatus.includes('today')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const renderTestSteps = (steps) => {
    if (!steps || steps.length === 0) return <p className="text-sm text-gray-500">No steps defined</p>;
    
    return (
      <div className="mt-1 text-sm text-gray-700 bg-gray-50 p-2 rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="text-xs font-medium pr-2">#</th>
              <th className="text-xs font-medium pr-2">Step</th>
              <th className="text-xs font-medium">Expected Result</th>
              <th className="text-xs font-medium w-16">Status</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr key={step.id || step.step_number} className="border-t border-gray-200">
                <td className="py-1 pr-2 text-xs">{step.step_number}</td>
                <td className="py-1 pr-2 text-xs">{step.step_description}</td>
                <td className="py-1 pr-2 text-xs">{step.expected_result}</td>
                <td className="py-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(step.status)}`}>
                    {step.status === 'not_run' ? 'Not Run' : 
                     step.status === 'passed' ? 'Passed' : 
                     step.status === 'failed' ? 'Failed' : step.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className=" mx-auto">
      
      <div className="relative w-80 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input type="text" placeholder="Search Test Cases..." className="w-full p-2 pl-10 bg-gray-100 rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          
          {projectsLoading && <p className="text-sm text-gray-500">Loading projects...</p>}
          {projectsError && <p className="text-sm text-red-500">{projectsError}</p>}
          
          <div className="space-y-2">
            {projects?.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  className={`w-full text-left px-3 py-2 rounded-md ${
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
        
        <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Modules</h2>
          
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
        
        <div className="col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Test Cases</h2>
            {selectedModule && (
              <button 
                className="text-sm px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setIsAddingTestCase(!isAddingTestCase)}
              >
                + Add Test Case
              </button>
            )}
          </div>
          
          {isAddingTestCase && (
            <div className="mb-4 p-3 border rounded-md bg-white">
              <h3 className="font-medium mb-2">New Test Case</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Test Case ID"
                  className="w-full p-2 border rounded"
                  value={newTestCase.test_id}
                  onChange={(e) => setNewTestCase({ ...newTestCase, test_id: e.target.value })}
                />
                <select
              className="w-full p-2 border rounded"
              value={newTestCase.test_type}
              onChange={(e) => setNewTestCase({ ...newTestCase, test_type: parseInt(e.target.value) })}
            >
              {testTypes.map(testType => (
                <option key={testType.id} value={testType.id}>
                  {testType.name}
                </option>
              ))}
            </select>
            <div className="flex items-center mt-2">
  <input
    type="text"
    placeholder="New Test Type"
    className="w-full p-2 border rounded mr-2"
    value={newTestType}
    onChange={(e) => setNewTestType(e.target.value)}
  />
  <button 
    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onClick={handleAddTestType}
  >
    Add Type
  </button>
</div>
              </div>
              
              <input
                type="text"
                placeholder="Test Case Title"
                className="w-full mb-2 p-2 border rounded"
                value={newTestCase.test_title}
                onChange={(e) => setNewTestCase({ ...newTestCase, test_title: e.target.value })}
              />
              
              <textarea
                placeholder="Test Description"
                className="w-full mb-2 p-2 border rounded"
                value={newTestCase.test_description}
                onChange={(e) => setNewTestCase({ ...newTestCase, test_description: e.target.value })}
                rows={2}
              />
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Precondition</label>
                  <textarea
                    placeholder="Precondition"
                    className="w-full p-2 border rounded"
                    value={newTestCase.precondition}
                    onChange={(e) => setNewTestCase({ ...newTestCase, precondition: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postcondition</label>
                  <textarea
                    placeholder="Postcondition"
                    className="w-full p-2 border rounded"
                    value={newTestCase.postcondition}
                    onChange={(e) => setNewTestCase({ ...newTestCase, postcondition: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">Test Steps</label>
                  <button 
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded" 
                    onClick={addTestStep}
                  >
                    + Add Step
                  </button>
                </div>
                
                {testSteps.map((step, index) => (
                  <div key={index} className="mb-2 p-2 border rounded bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Step {step.step_number}</span>
                      {testSteps.length > 1 && (
                        <button 
                          className="text-xs text-red-500"
                          onClick={() => removeTestStep(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <textarea
                        placeholder="Step Description"
                        className="w-full p-2 border rounded text-sm"
                        value={step.step_description}
                        onChange={(e) => handleTestStepChange(index, 'step_description', e.target.value)}
                        rows={2}
                      />
                      <textarea
                        placeholder="Expected Result"
                        className="w-full p-2 border rounded text-sm"
                        value={step.expected_result}
                        onChange={(e) => handleTestStepChange(index, 'expected_result', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={newTestCase.due_date}
                    onChange={(e) => setNewTestCase({ ...newTestCase, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newTestCase.priority}
                    onChange={(e) => setNewTestCase({ ...newTestCase, priority: e.target.value })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Assign to Test Engineers</label>
            {testEngineers.length === 0 ? (
              <p className="text-sm text-gray-500">Loading test engineers...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
              {testEngineers.map((engineer) => (
  <div key={engineer.user_id} className="flex items-center gap-2">
    <input
      type="checkbox"
      id={`engineer-${engineer.user_id}`}
      checked={newTestCase.assignedUsers.includes(engineer.user_id)}
      onChange={() => handleUserSelect(engineer.user_id)}
      className="cursor-pointer"
    />
    <label htmlFor={`engineer-${engineer.user_id}`} className="cursor-pointer text-sm">
      {engineer.full_name}
    </label>
  </div>
))}
              </div>
            )}
          </div>
              
              <div className="flex justify-end gap-2 mt-3">
                <button 
                  className="px-3 py-1 text-sm border rounded"
                  onClick={handleCancelTestCaseForm}
                >
                  Cancel
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  onClick={handleAddTestCase}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          
          {testsLoading ? (
            <p className="text-sm text-gray-500">Loading test cases...</p>
          ) : testsError ? (
            <p className="text-sm text-red-500">{testsError}</p>
          ) : selectedModule ? (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {tests && tests.length > 0 ? (
                tests.map((testCase) => (
                  <div key={testCase.id} className="p-4 border  rounded-md bg-white">

    <FiMoreHorizontal size={20} className="text-gray-500  hover:text-gray-700 cursor-pointer" />
  <div className="flex justify-between items-start">
                   
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <span className="text-gray-500 text-xs">{testCase.test_id}</span>
                          {testCase.test_title}
                        </h3>
                       
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeClass(testCase.priority)}`}>
                          {testCase.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(testCase.status)}`}>
                          {testCase.status}
                        </span>
                      </div>
                    </div>
                    
                    {typeof testCase.progress !== 'undefined' && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span>Progress</span>
                          <span>{testCase.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${testCase.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 text-sm">
                      <p className="text-gray-700">{testCase.test_description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Test Steps</h4>
                      {testCase.test_steps ? renderTestSteps(testCase.test_steps) : renderTestSteps([])}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium">Precondition</h4>
                        <div className="mt-1 text-sm text-gray-700">
                          {testCase.precondition || "None"}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Postcondition</h4>
                        <div className="mt-1 text-sm text-gray-700">
                          {testCase.postcondition || "None"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Assigned To</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {testCase.assigned_users && testCase.assigned_users.length > 0 ? (
                            testCase.assigned_users.map((user) => (
                              <span key={user.user_id} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1">
                                {user.username}
                                <span className={`w-2 h-2 rounded-full ${getStatusBadgeClass(user.status)}`}></span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">Not assigned</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <h4 className="text-sm font-medium">Due Date</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">{testCase.due_date || "Not set"}</span>
                          {testCase.due_status && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getDueDateStatusBadgeClass(testCase.due_status)}`}>
                              {testCase.due_status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {testCase.test_comments && testCase.test_comments.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h4 className="text-sm font-medium">Comments</h4>
                        <div className="space-y-2 mt-2">
                          {testCase.test_comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-2 rounded text-sm">
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end gap-2">
                     
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No test cases available for this module</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a module to view test cases</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCaseManagement;