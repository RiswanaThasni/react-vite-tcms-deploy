

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { listDeveloperTasks } from "../../../api/taskApi";
import randomColor from 'randomcolor'; // Import the randomColor library

const TaskList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [taskColors, setTaskColors] = useState({});

  // Get the filter type from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "all";
    setFilterType(type);
  }, [location.search]);

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const taskData = await listDeveloperTasks();
        setTasks(taskData);
        
        // Generate colors for each task when tasks are loaded
        const colors = {};
        taskData.forEach(task => {
          // Generate a base color with randomcolor
          const baseColor = randomColor({
            luminosity: 'light', // 'light' ensures we get pastel-like colors
            hue: 'random'        // random hue for variety
          });
          
          colors[task.id] = baseColor;
        });
        
        setTaskColors(colors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on filterType and search term
  useEffect(() => {
    let result = [...tasks];
    
    // Apply status filter
    if (filterType === "completed") {
      result = result.filter(task => task.status === "completed");
    } else if (filterType === "pending") {
      result = result.filter(task => task.status === "in_progress");
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(task => 
        task.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.task_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filterType, searchTerm]);

  const handleTaskClick = (taskId) => {
    navigate(`/dev_dashboard/tasks/${taskId}`);
  };

  const handleBack = () => {
    navigate("/dev_dashboard");
  };

  // Function to get a darker shade of a color for accents
  const getDarkerShade = (color) => {
    // Remove the # if it exists
    color = color.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Darken by reducing each component by 20%
    r = Math.floor(r * 0.8);
    g = Math.floor(g * 0.8);
    b = Math.floor(b * 0.8);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Function to determine if text should be dark or light based on background
  const getTextColor = (bgColor) => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance - formula commonly used to determine text color
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#333333' : '#ffffff';
  };

  const getStatusColor = (status) => {
    return status === "completed" ? "bg-green-100 text-green-800" :
           status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
           "bg-blue-100 text-blue-800";
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "bg-red-100 text-red-800" :
           priority === "medium" ? "bg-orange-100 text-orange-800" :
           "bg-blue-100 text-blue-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const getFilterTitle = () => {
    switch(filterType) {
      case "completed":
        return "";
      case "pending":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={13} />
          </button>
          <h1 className="text-sm font-medium"> Back to Dashboard</h1>
        </div>
        
        {/* Search */}
        <div className="relative w-64">
          <input
            type="text" 
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 bg-white rounded-lg text-sm "
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* Task Count */}
      <div className="mb-4  p-1">
        <span className="text-sm font-medium">
          Showing {filteredTasks.length} {filterType !== "all" ? `${filterType} ` : ""}tasks
        </span>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No {filterType !== "all" ? `${filterType} ` : ""}tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const baseColor = taskColors[task.id] || '#f8f9fa';
            const accentColor = getDarkerShade(baseColor);
            const textColor = getTextColor(baseColor);
            
            return (
              <div 
                key={task.id}
                className="shadow-sm rounded-lg overflow-hidden cursor-pointer transition duration-200 hover:shadow-md border border-gray-100"
                onClick={() => handleTaskClick(task.id)}
                style={{ backgroundColor: baseColor }}
              >
                {/* Card header with task name and statuses */}
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: textColor }}>
                    {task.project_name}
                  </span>
                  <div className="flex gap-1">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                {/* Card body */}
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-2" style={{ color: textColor }}>
                    {task.task_name}
                  </h3>
                  <p className="text-xs line-clamp-2 h-8" style={{ color: textColor }}>
                    {task.task_description}
                  </p>
                </div>
                
                {/* Card footer */}
                <div className="px-3 py-2">
                  <div className="flex justify-between items-center text-xs mb-2" style={{ color: textColor }}>
                    <div>Assigned to: {task.assigned_to_name}</div>
                    <div className={task.due_status.includes("Overdue") ? "text-red-600 font-medium" : ""}>
                      Due: {formatDate(task.due_date)}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  {/* <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${task.progress}%`,
                        backgroundColor: accentColor
                      }}
                    ></div>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
