import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBugDetail, updateFixedTaskStatus } from "../../../api/taskApi";
import { API_URL } from "../../../utils/constants";

const FixBugs = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [bugData, setBugData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState({});

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxSize);
    setAttachmentFiles(prev => [...prev, ...validFiles]);
  };

  const handleViewAttachment = (e, attachmentUrl) => {
    e.preventDefault();
    const apiBaseUrl = API_URL;
    const fullUrl = attachmentUrl.startsWith('http') 
      ? attachmentUrl 
      : `${apiBaseUrl}${attachmentUrl}`;
    
    window.open(fullUrl, '_blank');
  };

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        const data = await getBugDetail(taskId);
        setBugData(data);
        
        // Initialize resolution notes for each bug
        if (data && data.bugs) {
          const notes = {};
          data.bugs.forEach(bug => {
            notes[bug.id] = "";
          });
          setResolutionNotes(notes);
        }
      } catch (err) {
        setError(err.message || "Failed to load bug details");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchBugDetails();
    }
  }, [taskId]);

  const handleBackClick = () => {
    navigate("/dev_dashboard/reassign_task");
  };

  const handleResolutionNotesChange = (bugId, value) => {
    setResolutionNotes(prev => ({
      ...prev,
      [bugId]: value
    }));
  };

  const handleStartFix = async (bugId) => {
    try {
      setUpdating(true);
      await updateFixedTaskStatus(bugId, "in_progress", resolutionNotes[bugId]);
      
      // Update the local state to reflect the change
      setBugData(prevData => ({
        ...prevData,
        bugs: prevData.bugs.map(bug => 
          bug.id === bugId 
            ? { ...bug, fix_status: "in_progress", status: "in_progress" }
            : bug
        )
      }));
    } catch (err) {
      setError(err.message || "Failed to update bug status");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkFixed = async (bugId) => {
    try {
      setUpdating(true);
      await updateFixedTaskStatus(bugId, "fixed", resolutionNotes[bugId]);
      
      // Update the local state to reflect the change
      setBugData(prevData => ({
        ...prevData,
        bugs: prevData.bugs.map(bug => 
          bug.id === bugId 
            ? { 
                ...bug, 
                fix_status: "fixed", 
                status: "resolved",
                resolution_notes: resolutionNotes[bugId] 
              }
            : bug
        )
      }));
    } catch (err) {
      setError(err.message || "Failed to update bug status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-3">
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-2 text-sm"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Bugs List
      </button>

      <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
        {loading ? (
          <p className="text-center py-3 text-sm">Loading bug details...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-sm">{error}</p>
        ) : bugData ? (
          <>
            <h2 className="text-base font-medium mb-3">Bug Details #{bugData.task_id}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900 w-1/3">Task Name</td>
                    <td className="px-3 py-2 text-gray-500">{bugData.task_name}</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Task Description</td>
                    <td className="px-3 py-2 text-gray-500 whitespace-normal break-words">
                      {bugData.task_description}
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Task Status</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bugData.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : bugData.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bugData.status}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-3 py-2 font-medium text-gray-900">Due Date</td>
                    <td className="px-3 py-2 text-gray-500">
                      {bugData.due_date ? new Date(bugData.due_date).toLocaleDateString() : "No Due Date"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium mb-3">Bugs to Fix</h3>
              {bugData.bugs && bugData.bugs.length > 0 ? (
                bugData.bugs.map((bug) => (
                  <div key={bug.id} className="mb-4 border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">
                        {bug.bug_id}: {bug.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bug.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : bug.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : bug.priority === "High" || bug.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bug.status} - {bug.priority}
                      </span>
                    </div>
                    
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900 w-1/3">Description</td>
                          <td className="px-3 py-2 text-gray-500 whitespace-normal break-words">
                            {bug.description}
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900">Severity</td>
                          <td className="px-3 py-2 text-gray-500">{bug.severity}</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900">Steps to Reproduce</td>
                          <td className="px-3 py-2 text-gray-500 whitespace-normal break-words">
                            {bug.steps_to_reproduce}
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900">Environment</td>
                          <td className="px-3 py-2 text-gray-500">{bug.environment}</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900">Reported By</td>
                          <td className="px-3 py-2 text-gray-500">{bug.reported_by.full_name}</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900">Test Case Result</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                bug.test_case_result.result === "passed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {bug.test_case_result.result}
                            </span>
                            <span className="ml-2 text-gray-500">{bug.test_case_result.remarks}</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-3 py-2 font-medium text-gray-900">Fix Status</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                bug.fix_status === "fixed" || bug.fix_status === "closed"
                                  ? "bg-green-100 text-green-800"
                                  : bug.fix_status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {bug.fix_status}
                            </span>
                          </td>
                        </tr>
                        {bug.resolution_notes && (
                          <tr className="hover:bg-blue-50 transition-colors duration-150">
                            <td className="px-3 py-2 font-medium text-gray-900">Resolution Notes</td>
                            <td className="px-3 py-2 text-gray-500 whitespace-normal break-words">
                              {bug.resolution_notes}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {bug.attachments && bug.attachments.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {bug.attachments.map(attachment => (
                            <div key={attachment.id} className="flex items-center">
                              <a 
                                href="#"
                                onClick={(e) => handleViewAttachment(e, attachment.file)}
                                className="text-xs text-blue-600 hover:underline flex items-center"
                              >
                                {attachment.file.split('/').pop()}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add resolution notes input field */}
                    {(bug.fix_status === "pending" || bug.fix_status === "in_progress") && (
                      <div className="mt-3">
                        <label htmlFor={`resolution-${bug.id}`} className="block text-sm font-medium text-gray-700">
                          Resolution Notes
                        </label>
                        <textarea
                          id={`resolution-${bug.id}`}
                          value={resolutionNotes[bug.id] || ""}
                          onChange={(e) => handleResolutionNotesChange(bug.id, e.target.value)}
                          className="mt-1 p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                          rows="3"
                          placeholder="Describe your fix approach or what you've fixed"
                        />
                      </div>
                    )}

                    <div className="flex justify-end mt-3">
                      {bug.fix_status === "pending" && (
                        <button
                          onClick={() => handleStartFix(bug.id)}
                          disabled={updating}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {updating ? "Processing..." : "Start Fix"}
                        </button>
                      )}

                      {bug.fix_status === "in_progress" && (
                        <button
                          onClick={() => handleMarkFixed(bug.id)}
                          disabled={updating}
                          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                        >
                          {updating ? "Processing..." : "Mark as Fixed"}
                        </button>
                      )}

                      {(bug.fix_status === "fixed" || bug.fix_status === "closed") && (
                        <button 
                          className="bg-gray-400 text-white px-3 py-1.5 rounded text-sm cursor-not-allowed" 
                          disabled
                        >
                          Fix Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No bugs associated with this task.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-sm">No bug details found.</p>
        )}
      </div>
    </div>
  );
};

export default FixBugs;