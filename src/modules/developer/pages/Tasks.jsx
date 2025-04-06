


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
  const [updating, setUpdating] = useState(false);

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
    // Use the numeric ID directly - extract it from the ID used in the URL or task data
    // We'll use just the ID from the URL params (taskId) as that's what was used to load the task
    if (!taskId) {
      setError("Task ID not found");
      return;
    }

    setUpdating(true);
    setError(null); // Clear any previous errors
    
    try {
      // Update the task status via API - passing the ID that's used in the URL
      await updateTaskStatus(taskId, newStatus);

      // Update the local state to reflect changes
      setTaskData((prevTask) => {
        // Create updated task object
        const updatedTaskData = {
          ...prevTask,
          status: newStatus,
        };
        
        // If this is a bug_fix task, update the bug status as well
        if (updatedTaskData.bug_details) {
          updatedTaskData.bug_details = {
            ...updatedTaskData.bug_details,
            status: newStatus,
            // Map task statuses to appropriate bug fix_status values
            fix_status: getFixStatusFromTaskStatus(newStatus)
          };
        }
        
        return updatedTaskData;
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      setError(error.message || "Failed to update task status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Helper function to map task status to fix_status values
  const getFixStatusFromTaskStatus = (taskStatus) => {
    const statusMap = {
      "to_do": "Not Started",
      "in_progress": "In Progress",
      "completed": "Fixed"
    };
    
    return statusMap[taskStatus] || taskStatus;
  };

  const handleBackClick = () => {
    navigate("/dev_dashboard/task_details");
  };

  // Helper function to render severity badge
  const renderSeverityBadge = (severity) => {
    const severityClasses = {
      critical: "bg-red-100 text-red-800",
      major: "bg-orange-100 text-orange-800",
      minor: "bg-yellow-100 text-yellow-800",
      trivial: "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${severityClasses[severity.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
        {severity}
      </span>
    );
  };

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    let statusClass = "bg-yellow-100 text-yellow-800";
    
    if (status === "Completed" || status === "completed") {
      statusClass = "bg-green-100 text-green-800";
    } else if (status === "In Progress" || status === "in_progress") {
      statusClass = "bg-blue-100 text-blue-800";
    }
    
    return (
      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {status}
      </span>
    );
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
        {loading ? (
          <p className="text-center py-3 text-sm">Loading task details...</p>
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
                    <td className="px-3 py-2 font-medium text-gray-900">Module Name</td>
                    <td className="px-3 py-2 text-gray-500">{taskData.module_name}</td>
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
                      {renderStatusBadge(taskData.status)}
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

            {/* Bug Details Section - Only shown for bug_fix task types */}
            {taskData.bug_details && (
              <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-200">
                <h3 className="text-base font-medium mb-2 text-blue-800">Bug Details #{taskData.bug_details.bug_id}</h3>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900 w-1/3">Bug Title</td>
                      <td className="px-3 py-2 text-gray-500">{taskData.bug_details.title}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Severity</td>
                      <td className="px-3 py-2">
                        {renderSeverityBadge(taskData.bug_details.severity)}
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Bug Status</td>
                      <td className="px-3 py-2">
                        {renderStatusBadge(taskData.bug_details.status)}
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Fix Status</td>
                      <td className="px-3 py-2 text-gray-500">{taskData.bug_details.fix_status}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Reported By</td>
                      <td className="px-3 py-2 text-gray-500">{taskData.bug_details.reported_by.full_name}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Environment</td>
                      <td className="px-3 py-2 text-gray-500">{taskData.bug_details.environment}</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Bug Description</td>
                      <td className="px-3 py-2 text-gray-500 whitespace-normal break-words">
                        {taskData.bug_details.description}
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-3 py-2 font-medium text-gray-900">Steps to Reproduce</td>
                      <td className="px-3 py-2 text-gray-500 whitespace-pre-line">
                        {taskData.bug_details.steps_to_reproduce}
                      </td>
                    </tr>
                    {taskData.bug_details.attachments && taskData.bug_details.attachments.length > 0 && (
                      <tr className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-3 py-2 font-medium text-gray-900">Attachments</td>
                        <td className="px-3 py-2">
                          {taskData.bug_details.attachments.map((attachment, index) => (
                            <div key={attachment.id} className="mb-1">
                              <a 
                                href={attachment.file} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline flex items-center"
                              >
                                Attachment {index + 1}
                              </a>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Task comments section */}
            {taskData.comments && taskData.comments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-base font-medium mb-2">Comments</h3>
                <div className="space-y-2">
                  {taskData.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-2 rounded border border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{comment.user_name}</span>
                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-3">
              {updating ? (
                <button
                  className="bg-gray-400 text-white px-3 py-1.5 rounded text-sm cursor-wait"
                  disabled
                >
                  Updating...
                </button>
              ) : (taskData.status === "to_do" || taskData.status === "To Do") && (
                <button
                  onClick={() => handleStatusChange("in_progress")}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Start Task
                </button>
              )}

              {!updating && (taskData.status === "in_progress" || taskData.status === "In Progress") && (
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