import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeveloperTasks } from '../../../redux/slices/developerTaskSlice';

const TaskDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tasks, loading, error } = useSelector((state) => state.developerTasks || {});
console.log("Redux Tasks State:", tasks);
 

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
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg">
      <div className="relative w-80 items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search Tasks..."
          className="w-full p-2 pl-10 bg-gray-100 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border-1 border-dashed border-gray-100 mx-auto rounded-lg w-full">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full flex mt-6 mr-2 justify-end">
            <select
              className="w-64 p-2 border border-gray-300 focus:outline-none rounded-md"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              {projects.map((project) => (
  <option key={project} value={project}>{project}</option> 
))}

            </select>
          </div>
        </div>

        <hr className="border-dashed border-gray-300 mt-2 mx-auto" />

        <div className="mt-4 p-3">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            {loading ? (
              <p className="text-center py-4">Loading tasks...</p>
            ) : error ? (
              <p className="text-center py-4 text-red-500">{error}</p>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Task Name</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Project</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr 
                        key={task.id} 
                        onClick={() => handleRowClick(task.id)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-3 px-4">{task.task_name}</td>
                        <td className="py-3 px-4">{task.project_name}</td>
                        <td className="py-3 px-4">
  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No Due Date"}
</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
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
