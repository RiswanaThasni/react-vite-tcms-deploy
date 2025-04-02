import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { listTaskByBug } from '../../../api/taskApi';
import { useNavigate } from 'react-router-dom';

const ReassignTask = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listTaskByBug();
        setTaskData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const fixStatuses = [...new Set(taskData.flatMap(task => task.bugs.map(bug => bug.fix_status)))];

  const filteredTasks = taskData.filter(task => 
    task.task_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || task.bugs.some(bug => bug.fix_status === statusFilter))
  );

  const handleRowClick = (taskId) => {
    navigate(`/dev_dashboard/fix_bugs/${taskId}`);
  };


  return (
    <div className="p-2 max-w-6xl mx-auto bg-mainsection rounded-lg">
      
      <div className="relative w-80 mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search Tasks..."
          className="w-full p-1.5 pl-8 bg-white rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full  flex mt-4 justify-end">
        <select
          className="w-64 p-1.5 border bg-white border-gray-300 focus:outline-none rounded-md text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Fix Statuses</option>
          {fixStatuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center py-3 text-sm">Loading tasks and bugs...</p>
      ) : error ? (
        <p className="text-center py-3 text-sm text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-slate-200 text-sm mt-2  rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Task ID</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Task Name</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Priority</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Status</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Due Date</th>
              <th className="py-2 px-3 text-left font-medium text-gray-600">Bugs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50 cursor-pointer"
                                      onClick={() => handleRowClick(task.id)}
                                      >
                <td className="py-2 px-3">{task.task_id}</td>
                <td className="py-2 px-3">{task.task_name}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>{task.priority}</span>
                </td>
                <td className="py-2 px-3">
                  {task.bugs.map((bug, index) => (
                    <span key={index} className={`px-2 py-1 rounded-md text-xs font-medium mr-1 ${
                      bug.fix_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      bug.fix_status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'}`}>{bug.fix_status}</span>
                  ))}
                </td>
                <td className="py-2 px-3">{task.due_date}</td>
                <td className="py-2 px-3">{task.bugs.length}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-3 px-3 text-center text-gray-500">No tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReassignTask;
