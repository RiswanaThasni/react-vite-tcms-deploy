import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, AlertCircle, Search } from 'lucide-react';
import { fetchTasks } from '../../../redux/slices/taskSlice';
import { useNavigate } from 'react-router-dom';


const TrackTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // Access tasks, loading, and error from the Redux store
  const { tasks = [], loading, error } = useSelector((state) => state.tasks);

  // Function to determine priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500 text-white px-2 py-0.5 rounded text-xs";
      case "medium": return "bg-yellow-500 text-white px-2 py-0.5 rounded text-xs";
      case "low": return "bg-green-500 text-white px-2 py-0.5 rounded text-xs";
      default: return "bg-blue-500 text-white px-2 py-0.5 rounded text-xs";
    }
  };

  // Function to determine due date status
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { text: "No due date set", class: "text-gray-500" };

    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { text: "Overdue", class: "text-red-600" };
    if (daysLeft === 0) return { text: "Due today", class: "text-orange-600" };
    if (daysLeft <= 2) return { text: `Due in ${daysLeft} days`, class: "text-yellow-600" };
    return { text: `${daysLeft} days left`, class: "text-green-600" };
  };

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks()); // Dispatch fetch tasks action
  }, [dispatch]);

  // Filter out completed tasks (those with completion percentage 100)
  const inProgressTasks = tasks.filter((task) => task.progress < 100);

  // Sort tasks by progress (in progress tasks only)
  const sortedTasks = [...inProgressTasks].sort((a, b) => b.progress - a.progress);
  const handleRowClick = (taskId) => {
    navigate(`/dev_dashboard/tasks/${taskId}`);
  };

  return (
    <div className="p-2 w-full mx-auto bg-mainsection">
      
      {/* Loading and error states */}
      {loading && <p className="text-sm">Loading tasks...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Tasks Progress Line */}
      <div className="bg-slate-200 p-3 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-medium text-gray-700">Tasks Progress</h2>
          <div className="flex space-x-2">
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
              {inProgressTasks.length} Tasks In Progress
            </span>
          </div>
        </div>

        {/* Progress Lines */}
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white p-2 rounded-md shadow-sm transition-colors duration-200 hover:bg-gray-100"
              onClick={() => handleRowClick(task.id)}

            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-800">{task.task_name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{task.project_name}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-1 md:mt-0">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar size={12} className="mr-1" />
                    <span className={getDueDateStatus(task.due_date).class}>
                      {task.due_status || 'No due date set'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <AlertCircle size={12} className="mr-1 text-gray-600" />
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs font-medium text-gray-700">{task.progress}% complete</span>
                  <span className="text-xs text-gray-500">{task.created_by}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      task.progress >= 75 ? "bg-green-500" :
                      task.progress >= 50 ? "bg-blue-500" :
                      task.progress >= 25 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackTask;