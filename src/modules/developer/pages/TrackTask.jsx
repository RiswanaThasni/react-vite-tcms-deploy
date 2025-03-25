import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, AlertCircle, Search } from 'lucide-react';
import { fetchTasks } from '../../../redux/slices/taskSlice';

const TrackTask = () => {
  const dispatch = useDispatch();

  // Access tasks, loading, and error from the Redux store
  const { tasks = [], loading, error } = useSelector((state) => state.tasks);

  // Function to determine priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-blue-500";
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

  return (
    <div className="p-1 w-full mx-auto bg-white">
      <div className="relative w-80 flex items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search Tasks..."
          className="w-full p-2 pl-10 bg-gray-100 rounded-md"
        />
      </div>

      {/* Loading and error states */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Tasks Progress Line */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Tasks Progress</h2>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
              {inProgressTasks.length} Tasks In Progress
            </span>
          </div>
        </div>

        {/* Progress Lines */}
        <div className="space-y-6">
          {sortedTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-md font-medium text-gray-800">{task.task_name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{task.project_name}</p>
                </div>

                <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    <span className={getDueDateStatus(task.due_date).class}>
                      {task.due_status || 'No due date set'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <AlertCircle size={14} className="mr-1" />
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{task.progress}% complete</span>
                  <span className="text-sm text-gray-500">{task.created_by}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
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
