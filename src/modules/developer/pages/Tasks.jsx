import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTaskStatus } from "../../../api/taskApi"; 

const Tasks = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(taskId);
        setTaskData(data);
      } catch (err) {
        setError(err.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    if (!taskData.id) return;
  
    try {
      const updatedTask = await updateTaskStatus(taskData.id, newStatus);
  
      setTaskData((prevTask) => ({
        ...prevTask,
        status: newStatus, 
      }));
  
    } catch (error) {
      console.error("Error updating task status:", error);
      alert(error);
    }
  };
  
  const handleBackClick = () => {
    navigate("/dev_dashboard/task_details");
  };

  return (
    <div className="p-3">
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-2 text-sm"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Task List
      </button>

      <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
        {loading ? (
          <p className="text-center py-3 text-sm">Loading task details...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-sm">{error}</p>
        ) : taskData ? (
          <>
            <h2 className="text-base font-medium mb-3">Task Details #{taskData.task_id}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900 w-1/3">Task Name</td>
                    <td className="px-3 py-2 text-gray-500">{taskData.task_name}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Assigned Project Manager</td>
                    <td className="px-3 py-2 text-gray-500">{taskData.created_by}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Project Name</td>
                    <td className="px-3 py-2 text-gray-500">{taskData.project_name}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Detailed Description</td>
                    <td className="px-3 py-2 text-gray-500 whitespace-normal break-words">
                      {taskData.task_description}
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Status</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          taskData.status === "Completed" || taskData.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : taskData.status === "In Progress" || taskData.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {taskData.status}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Due Date</td>
                    <td className="px-3 py-2 text-gray-500">
                      {taskData.due_date ? new Date(taskData.due_date).toLocaleDateString() : "No Due Date"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-3">
              {(taskData.status === "to_do" || taskData.status === "To Do") && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Start Task
                </button>
              )}

              {(taskData.status === "in_progress" || taskData.status === "In Progress") && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Mark as Complete
                </button>
              )}

              {(taskData.status === "completed" || taskData.status === "Completed") && (
                <button 
                  className="bg-gray-400 text-white px-3 py-1.5 rounded text-sm cursor-not-allowed" 
                  disabled
                >
                  Task Completed
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-sm">No task details found.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;