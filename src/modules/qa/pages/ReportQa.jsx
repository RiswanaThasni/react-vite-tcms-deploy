import React, { useState } from 'react';

const ReportQa = () => {
  // Sample data - replace with your actual data fetching logic
  const [testData, setTestData] = useState({
    summary: {
      total: 120,
      passed: 87,
      failed: 23,
      skipped: 10,
      passRate: 72.5
    },
    recentRuns: [
      { id: 1, date: '2025-03-18', testsPassed: 87, testsFailed: 23, testsSkipped: 10, duration: '1h 23m' },
      { id: 2, date: '2025-03-15', testsPassed: 92, testsFailed: 18, testsSkipped: 10, duration: '1h 30m' },
      { id: 3, date: '2025-03-12', testsPassed: 80, testsFailed: 30, testsSkipped: 10, duration: '1h 15m' },
    ],
    failedTests: [
      { id: 101, name: 'User Login Validation', component: 'Authentication', severity: 'High', assignedTo: 'Alex Chen', lastRun: '2025-03-18' },
      { id: 102, name: 'Payment Processing Error Handling', component: 'Checkout', severity: 'Critical', assignedTo: 'Maya Johnson', lastRun: '2025-03-18' },
      { id: 103, name: 'Search Results Pagination', component: 'Search', severity: 'Medium', assignedTo: 'Unassigned', lastRun: '2025-03-18' },
    ]
  });

  const [activeTab, setActiveTab] = useState('summary');

  // Simplified severity badge color mapping - more subtle
  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'critical': return 'bg-red-700';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      
      
      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-4">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-4 ${activeTab === 'summary' ? 'border-b-2 border-gray-600 font-medium' : 'text-gray-500'}`}
          >
            Summary
          </button>
          <button 
            onClick={() => setActiveTab('runs')}
            className={`py-2 px-4 ${activeTab === 'runs' ? 'border-b-2 border-gray-600 font-medium' : 'text-gray-500'}`}
          >
            Test Runs
          </button>
          <button 
            onClick={() => setActiveTab('failures')}
            className={`py-2 px-4 ${activeTab === 'failures' ? 'border-b-2 border-gray-600 font-medium' : 'text-gray-500'}`}
          >
            Failed Tests
          </button>
        </nav>
      </div>
      
      {/* Summary View */}
      {activeTab === 'summary' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded shadow border border-gray-100">
              <h3 className="text-sm text-gray-500 uppercase">Total Tests</h3>
              <p className="text-2xl font-bold text-gray-800">{testData.summary.total}</p>
            </div>
            <div className="bg-white p-4 rounded shadow border border-gray-100">
              <h3 className="text-sm text-gray-500 uppercase">Passed</h3>
              <p className="text-2xl font-bold text-gray-700">{testData.summary.passed}</p>
            </div>
            <div className="bg-white p-4 rounded shadow border border-gray-100">
              <h3 className="text-sm text-gray-500 uppercase">Failed</h3>
              <p className="text-2xl font-bold text-gray-700">{testData.summary.failed}</p>
            </div>
            <div className="bg-white p-4 rounded shadow border border-gray-100">
              <h3 className="text-sm text-gray-500 uppercase">Pass Rate</h3>
              <p className="text-2xl font-bold text-gray-800">{testData.summary.passRate}%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow mb-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Test Pass/Fail Visualization</h2>
            <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-600 flex items-center"
                style={{ width: `${testData.summary.passRate}%` }}
              >
                <span className="px-2 text-white">{testData.summary.passRate}%</span>
              </div>
            </div>
            <div className="flex text-sm mt-2">
              <span className="text-green-700 mr-4">■ Passed: {testData.summary.passed}</span>
              <span className="text-red-700 mr-4">■ Failed: {testData.summary.failed}</span>
              <span className="text-gray-500">■ Skipped: {testData.summary.skipped}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Failed Tests</h2>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-700">Test Name</th>
                  <th className="text-left py-2 text-gray-700">Component</th>
                  <th className="text-left py-2 text-gray-700">Severity</th>
                  <th className="text-left py-2 text-gray-700">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {testData.failedTests.slice(0, 3).map(test => (
                  <tr key={test.id} className="border-b">
                    <td className="py-2 text-gray-800">{test.name}</td>
                    <td className="py-2 text-gray-600">{test.component}</td>
                    <td className="py-2">
                      <span className={`${getSeverityColor(test.severity)} text-white text-xs px-2 py-1 rounded-full`}>
                        {test.severity}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">{test.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Test Runs View */}
      {activeTab === 'runs' && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Test Runs</h2>
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-700">Date</th>
                <th className="text-left py-2 text-gray-700">Duration</th>
                <th className="text-left py-2 text-gray-700">Passed</th>
                <th className="text-left py-2 text-gray-700">Failed</th>
                <th className="text-left py-2 text-gray-700">Skipped</th>
                <th className="text-left py-2 text-gray-700">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {testData.recentRuns.map(run => {
                const total = run.testsPassed + run.testsFailed + run.testsSkipped;
                const passRate = ((run.testsPassed / total) * 100).toFixed(1);
                
                return (
                  <tr key={run.id} className="border-b">
                    <td className="py-2 text-gray-800">{run.date}</td>
                    <td className="py-2 text-gray-800">{run.duration}</td>
                    <td className="py-2 text-gray-800">{run.testsPassed}</td>
                    <td className="py-2 text-gray-800">{run.testsFailed}</td>
                    <td className="py-2 text-gray-500">{run.testsSkipped}</td>
                    <td className="py-2 text-gray-800">{passRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Failed Tests View */}
      {activeTab === 'failures' && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Failed Tests</h2>
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              Export Report
            </button>
          </div>
          
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-700">Test ID</th>
                <th className="text-left py-2 text-gray-700">Test Name</th>
                <th className="text-left py-2 text-gray-700">Component</th>
                <th className="text-left py-2 text-gray-700">Severity</th>
                <th className="text-left py-2 text-gray-700">Assigned To</th>
                <th className="text-left py-2 text-gray-700">Last Run</th>
                <th className="text-left py-2 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testData.failedTests.map(test => (
                <tr key={test.id} className="border-b">
                  <td className="py-2 text-gray-800">{test.id}</td>
                  <td className="py-2 text-gray-800">{test.name}</td>
                  <td className="py-2 text-gray-600">{test.component}</td>
                  <td className="py-2">
                    <span className={`${getSeverityColor(test.severity)} text-white text-xs px-2 py-1 rounded-full`}>
                      {test.severity}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{test.assignedTo}</td>
                  <td className="py-2 text-gray-600">{test.lastRun}</td>
                  <td className="py-2">
                    <button className="text-gray-600 hover:text-gray-800 mr-2">
                      Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportQa;