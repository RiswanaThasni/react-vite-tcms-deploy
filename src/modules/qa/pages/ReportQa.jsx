import React, { useState, useEffect } from 'react';
import { QaSummaryReport, QaFailedTestReport } from '../../../api/testApi';


const ReportQa = () => {
  const [testData, setTestData] = useState({
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      passRate: 0
    },
    failedTests: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [detailedFailures, setDetailedFailures] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch summary data from API
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        const apiData = await QaSummaryReport();
        
        // Transform API data to match component structure
        const transformedData = {
          summary: {
            total: apiData.total_test_cases || 0,
            passed: apiData.passed_test_cases || 0,
            failed: apiData.failed_test_cases || 0,
            skipped: 0, // Not provided in API, set to 0 or calculate if needed
            passRate: apiData.pass_rate || 0
          },
          failedTests: apiData.recent_failed_test_cases.map(test => ({
            id: test.test_id,
            name: test.test_title,
            description: test.test_description,
            component: test.module_name,
            project: test.project_name,
            severity: determineSeverity(test), // Function to determine severity based on criteria
            assignedTo: 'Unassigned', // Not provided in API
            lastRun: formatDate(test.created_at),
            dueDate: formatDate(test.due_date)
          }))
        };
        
        setTestData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching QA data:", err);
        setError(err.message || "Failed to load data");
        setLoading(false);
      }
    };
    
    fetchSummaryData();
  }, []);

  // Fetch detailed failure data when switching to failures tab
  useEffect(() => {
    const fetchDetailedFailures = async () => {
      if (activeTab === 'failures') {
        try {
          setLoading(true);
          const failureData = await QaFailedTestReport();
          
          // Transform detailed failure data
          const transformedFailures = failureData.map(test => ({
            id: test.test_id,
            name: test.test_title,
            description: test.test_description,
            project: test.project_name,
            component: test.module_name,
            severity: determineSeverityFromBugs(test.bugs),
            lastRun: formatDate(test.created_at),
            dueDate: formatDate(test.due_date),
            executedBy: test.last_run?.executed_by || 'Unknown',
            remarks: test.last_run?.remarks || 'No remarks provided',
            bugs: test.bugs.map(bug => ({
              id: bug.id,
              bugId: bug.bug_id,
              title: bug.title,
              description: bug.description,
              priority: bug.priority,
              status: bug.status,
              severity: bug.severity,
              stepsToReproduce: bug.steps_to_reproduce,
              environment: bug.environment,
              reportedBy: bug.reported_by?.full_name || 'Unknown',
              assignedTo: bug.assigned_to?.full_name || 'Unassigned',
              fixStatus: bug.fix_status || 'pending',
              attachments: bug.attachments || []
            }))
          }));
          
          setDetailedFailures(transformedFailures);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching detailed failure data:", err);
          setError(err.message || "Failed to load detailed failure data");
          setLoading(false);
        }
      }
    };
    
    fetchDetailedFailures();
  }, [activeTab]);

  // Helper function to determine severity based on bugs
  const determineSeverityFromBugs = (bugs) => {
    if (!bugs || bugs.length === 0) return 'Low';
    
    // Check if any bug has Critical or High severity
    if (bugs.some(bug => bug.severity === 'Critical')) return 'Critical';
    if (bugs.some(bug => bug.severity === 'High')) return 'High';
    if (bugs.some(bug => bug.severity === 'Medium')) return 'Medium';
    return 'Low';
  };

  // Helper function to determine severity (you can customize this logic)
  const determineSeverity = (test) => {
    const today = new Date();
    const dueDate = new Date(test.due_date);
    const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) return 'Critical';
    if (daysDiff <= 3) return 'High';
    if (daysDiff <= 7) return 'Medium';
    return 'Low';
  };
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Simplified severity badge color mapping
  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'critical': return 'bg-red-700';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-500';
    }
  };

  // Handler for viewing test details
  const handleViewDetails = (test) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

  // Test details modal component
  const TestDetailsModal = () => {
    if (!selectedTest) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-1 w-11/12 max-w-3xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-bold">{selectedTest.name}</h2>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Test ID</p>
              <p>{selectedTest.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Project</p>
              <p>{selectedTest.project}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Module</p>
              <p>{selectedTest.component}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Run</p>
              <p>{selectedTest.lastRun}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p>{selectedTest.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Executed By</p>
              <p>{selectedTest.executedBy}</p>
            </div>
          </div>
          
          <div className="mb-2 text-sm">
            <p className="text-xs text-gray-500">Description</p>
            <p className="mt-1">{selectedTest.description}</p>
          </div>
          
          <div className="mb-3 text-sm">
            <p className="text-xs text-gray-500">Remarks</p>
            <p className="mt-1">{selectedTest.remarks}</p>
          </div>
          
          <h3 className="text-sm font-semibold mb-2">Related Bugs</h3>
          {selectedTest.bugs && selectedTest.bugs.length > 0 ? (
            <div>
              {selectedTest.bugs.map(bug => (
                <div key={bug.id} className="border rounded-lg p-2 mb-2 text-sm">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-sm">{bug.title}</h4>
                    <span className={`${getSeverityColor(bug.severity)} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {bug.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{bug.bugId}</p>
                  <p className="my-1 text-sm">{bug.description}</p>
                  
                  <div className="mt-2">
                    <h5 className="font-semibold text-xs">Steps to Reproduce</h5>
                    <p className="whitespace-pre-line text-xs">{bug.stepsToReproduce}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-xs text-gray-500">Environment</p>
                      <p>{bug.environment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="capitalize">{bug.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reported By</p>
                      <p>{bug.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fix Status</p>
                      <p className="capitalize">{bug.fixStatus}</p>
                    </div>
                  </div>
                  
                  {bug.attachments && bug.attachments.length > 0 && (
                    <div className="mt-2">
                      <h5 className="font-semibold text-xs">Attachments</h5>
                      <div className="flex gap-2 mt-1">
                        {bug.attachments.map(attachment => (
                          <div key={attachment.id} className="text-blue-600 text-xs">
                            {attachment.file.split('/').pop()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No bugs reported for this test case.</p>
          )}
          
          <div className="flex justify-end mt-3">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 mr-2"
            >
              Close
            </button>
            <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
              Generate Bug Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-3 text-center text-sm">Loading QA report data...</div>;
  }
  
  if (error) {
    return <div className="p-3 text-center text-red-600 text-sm">Error: {error}</div>;
  }

  return (
    <div className="p-3 left-2.5 mx-auto bg-slate-200 rounded-lg">
      {/* Tabs */}
      <div className="border-b mb-3">
        <nav className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`py-1 px-3 text-sm ${activeTab === 'summary' ? 'border-b-2 border-gray-600 font-medium' : 'text-gray-500'}`}
          >
            Summary
          </button>
         
          <button 
            onClick={() => setActiveTab('failures')}
            className={`py-1 px-3 text-sm ${activeTab === 'failures' ? 'border-b-2 border-gray-600 font-medium' : 'text-gray-500'}`}
          >
            Failed Tests
          </button>
        </nav>
      </div>
      
      {/* Summary View */}
      {activeTab === 'summary' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="bg-white p-2 rounded shadow border border-gray-100">
              <h3 className="text-xs text-gray-500 uppercase">Total Tests</h3>
              <p className="text-xl font-bold text-gray-800">{testData.summary.total}</p>
            </div>
            <div className="bg-white p-2 rounded shadow border border-gray-100">
              <h3 className="text-xs text-gray-500 uppercase">Passed</h3>
              <p className="text-xl font-bold text-green-400">{testData.summary.passed}</p>
            </div>
            <div className="bg-white p-2 rounded shadow border border-gray-100">
              <h3 className="text-xs text-gray-500 uppercase">Failed</h3>
              <p className="text-xl font-bold text-red-700">{testData.summary.failed}</p>
            </div>
            <div className="bg-white p-2 rounded shadow border border-gray-100">
              <h3 className="text-xs text-gray-500 uppercase">Pass Rate</h3>
              <p className="text-xl font-bold text-gray-800">{testData.summary.passRate}%</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded shadow mb-3 border border-gray-100">
            <h2 className="text-sm font-semibold mb-2 text-gray-800">Test Pass/Fail Visualization</h2>
            <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-lime-300 flex items-center"
                style={{ width: `${testData.summary.passRate}%` }}
              >
                <span className="px-1 text-white text-xs">{testData.summary.passRate}%</span>
              </div>
            </div>
            <div className="flex text-xs mt-1">
              <span className="text-green-400 mr-3">■ Passed: {testData.summary.passed}</span>
              <span className="text-red-700 mr-3">■ Failed: {testData.summary.failed}</span>
              {testData.summary.skipped > 0 && (
                <span className="text-gray-500">■ Skipped: {testData.summary.skipped}</span>
              )}
            </div>
          </div>

          {testData.failedTests.length > 0 && (
            <div className="bg-white p-3 rounded shadow border border-gray-100">
              <h2 className="text-sm font-semibold mb-2 text-gray-800">Recent Failed Tests</h2>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 text-xs text-gray-700">Test Name</th>
                    <th className="text-left py-1 text-xs text-gray-700">Component</th>
                    <th className="text-left py-1 text-xs text-gray-700">Severity</th>
                    <th className="text-left py-1 text-xs text-gray-700">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {testData.failedTests.map(test => (
                    <tr key={test.id} className="border-b">
                      <td className="py-1 text-xs text-gray-800">{test.name}</td>
                      <td className="py-1 text-xs text-gray-600">{test.component}</td>
                      <td className="py-1">
                        <span className={`${getSeverityColor(test.severity)} text-white text-xs px-1 py-0.5 rounded-full`}>
                          {test.severity}
                        </span>
                      </td>
                      <td className="py-1 text-xs text-gray-600">{test.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Failed Tests View */}
      {activeTab === 'failures' && (
        <div className="bg-white p-3 rounded shadow border border-gray-100">
          <div className="flex justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-800">Failed Tests</h2>
            {/* <button className="bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600">
              Export Report
            </button> */}
          </div>
          
          {detailedFailures.length === 0 ? (
            <p className="text-gray-500 py-2 text-sm">No failed tests to display.</p>
          ) : (
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 text-gray-700">Test ID</th>
                  <th className="text-left py-1 text-gray-700">Test Name</th>
                  <th className="text-left py-1 text-gray-700">Project</th>
                  <th className="text-left py-1 text-gray-700">Module</th>
                  {/* <th className="text-left py-1 text-gray-700">Severity</th> */}
                  <th className="text-left py-1 text-gray-700">Due Date</th>
                  <th className="text-left py-1 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {detailedFailures.map(test => (
                  <tr key={test.id} className="border-b">
                    <td className="py-1 text-gray-800">{test.id}</td>
                    <td className="py-1 text-gray-800">
                      <div className="text-xs">{test.name}</div>
                      <div className="text-xs text-gray-500">{test.description.substring(0, 40)}...</div>
                    </td>
                    <td className="py-1 text-gray-600">{test.project}</td>
                    <td className="py-1 text-gray-600">{test.component}</td>
                    {/* <td className="py-1">
                      <span className={`${getSeverityColor(test.severity)} text-white text-xs px-1 py-0.5 rounded-full`}>
                        {test.severity}
                      </span>
                    </td> */}
                    <td className="py-1 text-gray-600">{test.dueDate}</td>
                    <td className="py-1">
                      <button 
                        onClick={() => handleViewDetails(test)}
                        className="text-blue-600 hover:text-blue-800 mr-1 text-xs"
                      >
                        Details
                      </button>
                      {/* <button className="text-gray-600 hover:text-gray-800 text-xs">
                        Assign
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {/* Test Details Modal */}
      {showDetailsModal && <TestDetailsModal />}
    </div>
  );
};

export default ReportQa;