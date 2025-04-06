

import React, { useEffect, useState } from "react";
import { Search, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeveloperTasks } from '../../../redux/slices/developerTaskSlice';

const TaskDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(8);
  const [taskTypeFilter, setTaskTypeFilter] = useState("");


  const { tasks, loading, error } = useSelector((state) => state.developerTasks || {});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
    dispatch(fetchDeveloperTasks());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, projectFilter, taskTypeFilter]);

  const projects = tasks && tasks.length ? [...new Set(tasks.map((task) => task.project_name))] : [];

  const filteredTasks = tasks && tasks.length ? tasks.filter(task => {
    if (!task || !task.task_name) return false; 
    const matchesSearch = task.task_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = projectFilter === '' || task.project_name === projectFilter;
    const matchesTaskType = taskTypeFilter === '' || task.task_type === taskTypeFilter;

    return matchesSearch && matchesProject && matchesTaskType;  }) : [];


  const taskTypes = tasks && tasks.length 
  ? [...new Set(tasks.map((task) => task.task_type).filter(Boolean))] 
  : [];

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleRowClick = (taskId) => {
    navigate(`/dev_dashboard/tasks/${taskId}`);
  };

  return (
    <div className="p-2 max-w-6xl mx-auto bg-mainsection rounded-lg">
      <div className="relative w-80 items-center mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search Tasks..."
          className="w-full p-1.5 pl-8 bg-white rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border-1 border-dashed bg-slate-200 border-gray-100 mx-auto rounded-lg w-full">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="w-full flex mt-4 mr-2 gap-2 justify-end">

          <select  className="w-44 p-1.5 border bg-white border-gray-300 focus:outline-none rounded-md text-sm"
                        value={taskTypeFilter}
                        onChange={(e) => setTaskTypeFilter(e.target.value)}
                        >
              <option value="">All Task Types</option>
              {taskTypes.map((type) => (
                <option key={type} value={type}>{type}</option> 
              ))}
          </select>


            <select
              className="w-64 p-1.5 border bg-white border-gray-300 focus:outline-none rounded-md text-sm"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option> 
              ))}
            </select>
          </div>
        </div>

        <hr className="border-dashed border-gray-300 mx-auto" />

        <div className="mt-2 p-2">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            {loading ? (
              <p className="text-center py-3 text-sm">Loading tasks...</p>
            ) : error ? (
              <p className="text-center py-3 text-sm text-red-500">{error}</p>
            ) : (
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 text-left font-medium text-gray-600 border-b">Task Name</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-600 border-b">Project</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-600 border-b">Task Type</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-600 border-b">Status</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-600 border-b">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTasks.length > 0 ? (
                    currentTasks.map((task) => (
                      <tr 
                        key={task.id} 
                        onClick={() => handleRowClick(task.id)}
                        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      >
                        <td className="py-2 px-3">{task.task_name}</td>
                        <td className="py-2 px-3">{task.project_name}</td>
                        <td className="py-2 px-3">{task.task_type}</td>
                        <td className="py-2 px-3">{task.status}</td>
                        <td className="py-2 px-3">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No Due Date"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-3 px-3 text-center text-gray-500">
                        No tasks found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination UI */}
          {filteredTasks.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-300">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length} tasks
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-300 text-white hover:bg-lime-300'
                  }`}
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage >= totalPages
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-white hover:bg-lime-300'
                  }`}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;