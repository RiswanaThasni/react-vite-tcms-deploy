

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectByLead } from "../../../redux/slices/projectSlice";
import { fetchModules } from "../../../redux/slices/moduleSlice";
import { Search, FileText, Download, Paperclip } from "lucide-react";
import { addModuleApi, addTasksByModuleId } from "../../../api/projectApi";
import { fetchTasksByModule } from "../../../redux/slices/taskSlice"
import { getDevelopersByProject } from "../../../redux/slices/developerSlice";

const TaskManagement = () => {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [newModule, setNewModule] = useState({ id: "", name: "", description: "", due_date: "", priority: "high" });
  const [isAddingModule, setIsAddingModule] = useState(false);
  const fileInputRef = useRef(null);
  
  const initialTaskState = { 
    id: '',  
    name: '', 
    description: '', 
    assignedPersonId: '', 
    status: 'To Do',
    due_date: '',
    priority: 'medium',
    comment: '',
    documents: []
  };
  
  const [newTask, setNewTask] = useState(initialTaskState);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskFiles, setTaskFiles] = useState([]);

  const { projects, loading: projectsLoading, error: projectsError } = useSelector(state => state.projects);
  
  const { modules, loading: modulesLoading, error: modulesError } = useSelector(state => state.modules);
  
  const tasksState = useSelector(state => state.tasks) || { tasks: [], loading: false, error: null };
  const { tasks = [], loading: tasksLoading, error: tasksError } = tasksState;

  const { developers, loading: developersLoading } = useSelector(state => state.developers);

  useEffect(() => {
    if (selectedProject) {
      dispatch(getDevelopersByProject(selectedProject));
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    dispatch(getProjectByLead());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchModules(selectedProject));
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    if (selectedModule) {
      dispatch(fetchTasksByModule(selectedModule))
        .then(() => {
          console.log("Fetched tasks:", tasks); // Add this line
        });
    }
  }, [selectedModule, dispatch]);

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setSelectedModule(null);
  };

  const handleModuleSelect = (moduleId) => {
    console.log("Selected Module ID:", moduleId);
    setSelectedModule(moduleId);
    dispatch(fetchTasksByModule(moduleId)); 
  };

  const handleAddModule = async () => {
    if (!newModule.id.trim() || !newModule.name.trim()) {
      alert("Module ID and Name are required!");
      return;
    }

    const moduleData = { 
      Module_id: newModule.id, 
      module_name: newModule.name, 
      module_description: newModule.description, 
      due_date: newModule.due_date, 
      priority: newModule.priority
    };

    try {
      await addModuleApi(selectedProject, moduleData);
      
      alert("Module added successfully!");
      
      setNewModule({ id: "", name: "", description: "", due_date: "", priority: "high" });
      setIsAddingModule(false);
      
      dispatch(fetchModules(selectedProject));
    } catch (error) {
      console.error("Failed to add module:", error.response?.data || error.message);
      alert("Failed to add task: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setTaskFiles([...taskFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...taskFiles];
    updatedFiles.splice(index, 1);
    setTaskFiles(updatedFiles);
  };

  const handleAddTask = async () => {
  if (!newTask.name.trim() || !newTask.description.trim() || !newTask.assignedPersonId) {
    alert("Task Name, Description, and Assigned Person are required!");
    return;
  }

  // Create a FormData object to handle file uploads
  const formData = new FormData();
  
  // Add task data to formData
  formData.append("task_id", newTask.id);
  formData.append("task_name", newTask.name);
  formData.append("task_description", newTask.description);
  formData.append("assigned_to", newTask.assignedPersonId);
  formData.append("status", "to_do");
  formData.append("due_date", newTask.due_date);
  formData.append("priority", newTask.priority);
  
  // Add comment if provided
  if (newTask.comment) {
    formData.append("comment", newTask.comment);
  }
  
  // Add document - just send the first file if any exists
  if (taskFiles.length > 0) {
    formData.append("document", taskFiles[0]);
  }

  try {
    await addTasksByModuleId(selectedModule, formData);
    alert("Task added successfully!");
    
    setNewTask(initialTaskState);
    setTaskFiles([]);
    setIsAddingTask(false);
    
    dispatch(fetchTasksByModule(selectedModule));
  } catch (error) {
    console.error("Failed to add task:", error.response?.data || error.message);
    alert("Failed to add task: " + (error.response?.data?.message || "Unknown error"));
  }
};

  const handleTaskPersonSelect = (personId) => {
    setNewTask(prev => ({
      ...prev,
      assignedPersonId: personId
    }));
  };

  const getDeveloperName = (id) => {
    const dev = developers.find((developer) => developer.id === id);
    return dev ? dev.full_name : "Unknown Developer";
  };
  
  const handleCancelTaskForm = () => {
    setNewTask(initialTaskState);
    setTaskFiles([]);
    setIsAddingTask(false);
  };
  
  const handleCancelModuleForm = () => {
    setNewModule({ id: "", name: "", description: "", due_date: "", priority: "high" });
    setIsAddingModule(false);
  };

  const handleDownloadDocument = (url) => {
    // Extract filename from URL
    const filename = url.split('/').pop();
    
    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    
    // Trigger click to start download
    anchor.click();
    
    // Clean up
    document.body.removeChild(anchor);
  };

  return (
    <div className=" ">
      
      <div className="relative w-80 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input type="text" placeholder="Search Test Cases..." className="w-full p-2 pl-10 bg-white rounded-lg" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 bg-slate-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold mb-4">Projects</h2>
          
          {projectsLoading && <p className="text-sm text-gray-500">Loading projects...</p>}
          {projectsError && <p className="text-sm text-red-500">{projectsError}</p>}
          
          <div className="space-y-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  className={`w-full font-normal text-sm text-left px-3 py-2 rounded-md ${
                    selectedProject === project.id ? 'bg-gray-50 text-' : 'hover:bg-gray-100'
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
        
        <div className="col-span-1 bg-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Modules</h2>
            {selectedProject && (
              <button 
                className="text-sm px-2 py-1 bg-sidebar-hover text-white font-medium rounded-md hover:bg-lime-300"
                onClick={() => setIsAddingModule(!isAddingModule)}
              >
                + Add Module
              </button>
            )}
          </div>
          
          {isAddingModule && (
            <div className="mb-4 p-3 border rounded-md bg-white">
              <h3 className="font-medium mb-2">New Module</h3>
              <input
                type="text"
                placeholder="Module ID"
                className="w-full mb-2 p-2 border rounded"
                value={newModule.id}
                onChange={(e) => setNewModule({...newModule, id: e.target.value})}
              />
              <input
                type="text"
                placeholder="Module Name"
                className="w-full mb-2 p-2 border rounded"
                value={newModule.name}
                onChange={(e) => setNewModule({...newModule, name: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
                value={newModule.description}
                onChange={(e) => setNewModule({...newModule, description: e.target.value})}
              />
              <input
                type="date"
                className="w-full mb-2 p-2 border rounded"
                value={newModule.due_date}
                onChange={(e) => setNewModule({...newModule, due_date: e.target.value})}
              />
              <select
                className="w-full mb-2 p-2 border rounded"
                value={newModule.priority}
                onChange={(e) => setNewModule({...newModule, priority: e.target.value})}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="flex justify-end gap-2">
                <button 
                  className="px-3 py-1 text-sm border rounded"
                  onClick={handleCancelModuleForm}
                >
                  Cancel
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  onClick={handleAddModule}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          
          {modulesLoading ? (
            <p className="text-sm text-gray-500">Loading modules...</p>
          ) : modulesError ? (
            <p className="text-sm text-red-500">{modulesError}</p>
          ) : selectedProject ? (
            <div className="space-y-2 ">
              {modules.length > 0 ? (
                modules.map((module) => (
                  <button
                    key={module.id}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedModule === module.id ? 'bg-white text-black' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleModuleSelect(module.id)}
                  >
                    <div className="font-normal text-sm">{module.module_name}</div>
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
        
        <div className="col-span-2 bg-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Tasks</h2>
            {selectedModule && (
              <button 
                className="text-sm px-2 py-1 bg-sidebar-hover text-white font-medium rounded-md hover:bg-lime-300"
                onClick={() => setIsAddingTask(!isAddingTask)}
              >
                + Add Task
              </button>
            )}
          </div>
          
          {isAddingTask && (
  <div className="mb-4 p-3  rounded-md bg-white">
    <h3 className="font-medium mb-2">New Task</h3>
    <input
      type="text"
      placeholder="Task ID"
      className="w-full mb-2 p-2 border rounded"
      value={newTask.id}
      onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
    />
    <input
      type="text"
      placeholder="Task Name"
      className="w-full mb-2 p-2 border rounded"
      value={newTask.name}
      onChange={(e) => setNewTask({...newTask, name: e.target.value})}
    />
    <textarea
      placeholder="Description"
      className="w-full mb-2 p-2 border rounded"
      value={newTask.description}
      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
    />
    
    <div className="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={newTask.due_date}
          onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select
          className="w-full p-2 border rounded"
          value={newTask.priority}
          onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
    
    {/* Comment Field */}
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">Comment</label>
      <textarea
        placeholder="Add comment for this task..."
        className="w-full p-2 border rounded"
        value={newTask.comment}
        onChange={(e) => setNewTask({...newTask, comment: e.target.value})}
      />
    </div>
    
    {/* Document Upload Field */}
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">Upload Document</label>
      <div className="flex items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setTaskFiles([...taskFiles.slice(0, 0), ...Array.from(e.target.files)])}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-2 bg-gray-100 border rounded flex items-center gap-2 hover:bg-gray-200"
        >
          <Paperclip size={16} />
          <span>Select File</span>
        </button>
      </div>
      
      {/* Display selected file */}
      {taskFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Selected file:</p>
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {taskFiles[0].name}
            </span>
            <button 
              onClick={() => setTaskFiles([])}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
    
    <div className="mt-2">
      <label className="block text-sm font-medium mb-1">Assign to Developer</label>
      {developersLoading ? (
        <p className="text-sm text-gray-500">Loading developers...</p>
      ) : (
        developers.map((developer) => (
          <div key={developer.id} className="flex items-center gap-2">
            <input
              type="radio"
              id={`dev-${developer.id}`}
              name="assignedDeveloper"
              value={developer.id}
              checked={newTask.assignedPersonId === developer.id}
              onChange={() => handleTaskPersonSelect(developer.id)}
              className="cursor-pointer"
            />
            <label htmlFor={`dev-${developer.id}`} className="cursor-pointer">{developer.full_name}</label>
          </div>
        ))
      )}
    </div>

    {newTask.assignedPersonId && (
      <div className="mb-3 p-2 bg-gray-50 rounded mt-2">
        <h4 className="text-xs font-medium text-gray-600 mb-1">Selected developer:</h4>
        <div className="flex flex-wrap gap-1">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            {getDeveloperName(newTask.assignedPersonId)}
          </span>
        </div>
      </div>
    )}
    
    <div className="flex justify-end gap-2 mt-3">
      <button 
        className="px-3 py-1 text-sm border rounded"
        onClick={handleCancelTaskForm}
      >
        Cancel
      </button>
      <button 
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        onClick={handleAddTask}
      >
        Save
      </button>
    </div>
  </div>
)}
          {tasksLoading ? (
  <p className="text-sm text-gray-500">Loading tasks...</p>
) : tasksError ? (
  <p className="text-sm text-red-500">{tasksError}</p>
) : selectedModule ? (
  <div className="space-y-3 max-h-96 overflow-y-auto">
    {tasks.length > 0 ? (
      tasks.map((task) => (
        <div key={task.id} className="p-3  rounded-md bg-white">
          <div className="flex justify-between">
            <h3 className="font-medium"> <span className="text-gray-500 text-xs">{task.task_id} </span> 
            {task.task_name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              task.status === 'Completed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 my-1">{task.task_description}</p>
          
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Due: {task.due_date || 'Not set'}</span>
              <span>Priority: {task.priority || 'Medium'}</span>
            </div>
          </div>
          
          {/* Display Comments Section */}
          {task.comments && task.comments.length > 0 ? (
            <div className="mt-3  pt-2">
              <h4 className="text-xs font-medium text-gray-600 mb-1">Comments:</h4>
              <ul className="space-y-2">
                {task.comments.map((comment, index) => (
                  <li key={index} className="bg-gray-50 p-2 rounded text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium text-xs">{comment.user_name}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-3 border-t pt-2">
              <p className="text-xs text-gray-500">No comments yet</p>
            </div>
          )}
          
          {/* Display Document Section */}
          {task.document ? (
            <div className="mt-3 border-t pt-2">
              <h4 className="text-xs font-medium text-gray-600 mb-1">Document:</h4>
              <button 
                onClick={() => handleDownloadDocument(task.document)}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
              >
                <Download size={14} />
                <span>Download Document</span>
              </button>
            </div>
          ) : (
            <div className="mt-3 border-t pt-2">
              <p className="text-xs text-gray-500">No document attached</p>
            </div>
          )}
          
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500">Assigned to:</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.assigned_to ? (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {task.assigned_to_name || getDeveloperName(task.assigned_to)}
                </span>
              ) : (
                <span className="text-xs text-gray-500">Not assigned</span>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No tasks available for this module</p>
    )}
  </div>
) : (
  <p className="text-sm text-gray-500">Select a module to view tasks</p>
)}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;