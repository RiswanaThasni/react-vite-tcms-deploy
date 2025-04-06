import React, { useState, useEffect, useRef } from 'react';
import { FileText, Paperclip, X, AlertCircle } from 'lucide-react';
import { fetchDevelopersByProject } from '../../../api/taskApi';
import { assignBugTask } from '../../../api/projectApi';

const AddTaskPopup = ({ bugId, moduleId, projectId, onClose, onTaskAdded }) => {
  const [developers, setDevelopers] = useState([]);
  const [developersLoading, setDevelopersLoading] = useState(true);
  const [taskFiles, setTaskFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [newTask, setNewTask] = useState({
    taskId: '',
    taskName: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    comment: '',
    assignedPersonId: null,
    taskType: 'bug_fix' // Added default task type for bug fixes
  });

  useEffect(() => {
    const loadDevelopers = async () => {
      // Better validation for projectId
      if (!projectId) {
        console.error("Project ID is undefined or null");
        setLoadError("Missing project information. Please try again or contact support.");
        setDevelopersLoading(false);
        return;
      }
      
      try {
        console.log("Fetching developers for project:", projectId);
        const response = await fetchDevelopersByProject(projectId);
        if (response && Array.isArray(response)) {
          setDevelopers(response);
        } else {
          console.error("Invalid response format:", response);
          setLoadError("Received invalid data from server. Please try again.");
        }
        setDevelopersLoading(false);
      } catch (error) {
        console.error("Error fetching developers:", error);
        setLoadError(error.message || "Failed to load developers. Please try again.");
        setDevelopersLoading(false);
      }
    };
    
    loadDevelopers();
  }, [projectId]);

  
  const handleTaskPersonSelect = (developerId) => {
    setNewTask({
      ...newTask,
      assignedPersonId: developerId
    });
  };

  const getDeveloperName = (developerId) => {
    const developer = developers.find(dev => dev.id === developerId);
    return developer ? developer.full_name : 'Unknown';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newTask.taskId || !newTask.taskName || !newTask.description || 
        !newTask.dueDate || !newTask.assignedPersonId) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Ensure field names match exactly what the backend expects
      formData.append('task_id', newTask.taskId);
      formData.append('task_name', newTask.taskName);
      formData.append('task_description', newTask.description);
      formData.append('due_date', newTask.dueDate);
      formData.append('priority', newTask.priority);
      // formData.append('task_type', newTask.taskType); // Add task_type field
      
      // Convert assignedPersonId to string
      formData.append('assigned_to', String(newTask.assignedPersonId));
      
      // The comment field is optional
      if (newTask.comment) {
        formData.append('comment', newTask.comment);
      }
      
      // Add document only if present
      if (taskFiles.length > 0) {
        formData.append('document', taskFiles[0]);
      }
      
      // Check if bugId is valid before making the request
      if (!bugId) {
        throw new Error("Bug ID is missing");
      }
      
      // Log the FormData contents for debugging
      console.log("Form data values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      const result = await assignBugTask(bugId, formData);
      console.log("Task assignment successful:", result);
      onTaskAdded();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      alert(`Failed to create task: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Show error if projectId is missing
  if (!projectId) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Add Bug Fix Task</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            <span className="font-medium">Project ID Missing</span>
          </div>
          <p className="text-gray-600 text-center mb-6">
            Cannot add task because project information is missing. Please contact your system administrator.
          </p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Add Bug Fix Task</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Task ID*</label>
            <input
              type="text"
              placeholder="Enter task ID"
              className="w-full p-2 border rounded"
              value={newTask.taskId}
              onChange={(e) => setNewTask({ ...newTask, taskId: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Task Name*</label>
            <input
              type="text"
              placeholder="Enter task name"
              className="w-full p-2 border rounded"
              value={newTask.taskName}
              onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea
              placeholder="Enter task description"
              className="w-full p-2 border rounded min-h-24"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Due Date*</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full p-2 border rounded"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              placeholder="Add comment for this task..."
              className="w-full p-2 border rounded"
              value={newTask.comment}
              onChange={(e) => setNewTask({ ...newTask, comment: e.target.value })}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Upload Document</label>
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setTaskFiles(Array.from(e.target.files))}
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
            
            {taskFiles.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-sm">
                    <FileText size={14} />
                    {taskFiles[0].name}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setTaskFiles([])}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Assign to Developer*</label>
            {developersLoading ? (
              <p className="text-sm text-gray-500">Loading developers...</p>
            ) : loadError ? (
              <p className="text-sm text-red-500">{loadError}</p>
            ) : developers.length > 0 ? (
              <div className="max-h-40 overflow-y-auto p-2 border rounded">
                {developers.map((developer) => (
                  <div key={developer.id} className="flex items-center gap-2 py-1">
                    <input
                      type="radio"
                      id={`dev-${developer.id}`}
                      name="assignedDeveloper"
                      value={developer.id}
                      checked={newTask.assignedPersonId === developer.id}
                      onChange={() => handleTaskPersonSelect(developer.id)}
                      className="cursor-pointer"
                      required
                    />
                    <label 
                      htmlFor={`dev-${developer.id}`} 
                      className="cursor-pointer text-sm flex-1"
                    >
                      {developer.full_name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-500">No developers available</p>
            )}
          </div>

          {newTask.assignedPersonId && (
            <div className="mb-4 p-2 bg-gray-50 rounded">
              <h4 className="text-xs font-medium text-gray-600 mb-1">Selected developer:</h4>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {getDeveloperName(newTask.assignedPersonId)}
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
        <button 
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </div>
  );
};

export default AddTaskPopup;



