import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { getTestById, reportBug } from '../../../api/testApi';

const Bugs = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugId, setBugId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [environment, setEnvironment] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [severity, setSeverity] = useState('Medium');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getTestById(testId);
        setTestData(data);
      } catch (err) {
        setError(err.message || "Failed to load test case");
      } finally {
        setLoading(false);
      }
    };
  
    if (testId) {
      fetchTest();
    }
  }, [testId]);

  const handleBackClick = () => {
    navigate(`/testengineer_dashboard/tests/${testId}`);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
  
    try {
      const formData = new FormData();
      formData.append("remarks", remarks);
  
      if (attachment) {
        formData.append("attachment", attachment);
      }
  
      // Create the bug object only if the test case failed
      if (bugTitle && bugDescription) {
        const bug = {
          title: bugTitle,
          description: bugDescription,
          severity: severity,
          priority: priority,
          steps_to_reproduce: stepsToReproduce,
          environment: environment
        };
  
        if (bugId) {
          bug.bug_id = bugId; // Optional, should be unique if provided
        }
  
        // Append bug as a JSON string
        formData.append("bug", JSON.stringify(bug));
      }
  
      await reportBug(testId, formData);
  
      setSubmitMessage({
        type: "success",
        text: "Bug reported successfully!",
      });
  
      // Redirect after successful submission
      setTimeout(() => {
        navigate(`/testengineer_dashboard/tests/${testId}`);
      }, 2000);
    } catch (error) {
      console.error("Error reporting bug:", error);
      setSubmitMessage({
        type: "error",
        text: error.message || "Failed to report bug. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  
  if (loading) {
    return <div className="p-4 text-center">Loading test case details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!testData) {
    return <div className="p-4 text-center">No test case found with ID {testId}</div>;
  }

  return (
    <div className="p-4">
      {/* Back button */}
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Test Case
      </button>
      
      {/* Message display */}
      {submitMessage && (
        <div className={`p-3 mb-4 rounded ${
          submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {submitMessage.text}
        </div>
      )}
      
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Report Bug for Test Case #{testData.test_id || testData.id}</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Bug Reporting Instructions</h3>
          <p className="text-sm text-blue-700">
            For a failed test case, you must provide the bug details along with any optional attachment(s).
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Remarks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any general remarks about this bug report"
            ></textarea>
          </div>
          
          {/* Bug Information Section */}
          <div className="mb-4 p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-3">Bug Details</h3>
            
            {/* Bug ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bug ID (optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={bugId}
                onChange={(e) => setBugId(e.target.value)}
                placeholder="e.g., BUG123"
              />
              <p className="text-xs text-gray-500 mt-1">
                If not provided, one will be generated automatically
              </p>
            </div>
            
            {/* Bug Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bug Title (required)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                placeholder="Brief title describing the issue"
                required
              />
            </div>
            
            {/* Bug Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bug Description (required)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Detailed description of the bug including steps to reproduce"
                required
              ></textarea>
            </div>
            
            {/* Steps to Reproduce */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Steps to Reproduce
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                placeholder="1. Navigate to login page
2. Enter incorrect credentials
3. Click login button"
              ></textarea>
            </div>
            
            {/* Environment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                placeholder="Browser: Chrome 112.0.5615.138
OS: Windows 11
App Version: 2.4.1"
              ></textarea>
            </div>
            
            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          
          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bug Attachment (optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={24} className="text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">Screenshots, videos or log files</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {attachment && (
              <div className="mt-2">
                <p className="text-sm flex items-center text-gray-600">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  {attachment.name}
                </p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
              disabled={submitting || !bugTitle || !bugDescription}
            >
              {submitting ? 'Submitting...' : 'Submit Bug Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bugs;