import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeveloperTasks } from '../../../redux/slices/developerTaskSlice';

const TaskDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tasks, loading, error } = useSelector((state) => state.developerTasks || {});
  
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
    dispatch(fetchDeveloperTasks());
  }, [dispatch]);

  const projects = [...new Set(tasks.map((task) => task.project_name))];

  const filteredTasks = tasks.filter(task => {
    if (!task || !task.task_name) return false; 
    const matchesSearch = task.task_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = projectFilter === '' || task.project_name === projectFilter;
    return matchesSearch && matchesProject;
  });
  
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
          <div className="w-full flex mt-4 mr-2 justify-end">
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

        <div className="mt-2  p-2">
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
                    <th className="py-2 px-3 text-left font-medium text-gray-600 border-b">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr 
                        key={task.id} 
                        onClick={() => handleRowClick(task.id)}
                        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      >
                        <td className="py-2 px-3">{task.task_name}</td>
                        <td className="py-2 px-3">{task.project_name}</td>
                        <td className="py-2 px-3">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No Due Date"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-3 px-3 text-center text-gray-500">
                        No tasks found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;