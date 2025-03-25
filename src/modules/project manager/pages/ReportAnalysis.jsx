import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data for projects - replace with your actual data
const projectsData = [
  { name: 'Project A', progress: 75, tasks: 120, completed: 90, bugs: 15, tests: 240, passed: 210 },
  { name: 'Project B', progress: 45, tasks: 85, completed: 38, bugs: 22, tests: 150, passed: 120 },
  { name: 'Project C', progress: 90, tasks: 65, completed: 58, bugs: 7, tests: 180, passed: 172 },
  { name: 'Project D', progress: 30, tasks: 100, completed: 30, bugs: 18, tests: 200, passed: 140 },
  { name: 'Project E', progress: 60, tasks: 75, completed: 45, bugs: 12, tests: 120, passed: 95 }
];

const ReportAnalysis = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      
      {/* Projects Progress Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">All Projects Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
              <Bar 
                dataKey="progress" 
                fill="#4f46e5" 
                name="Progress (%)"
                onClick={(data) => handleProjectSelect(data)}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-500 mt-2 text-center">Click on any bar to view project details</div>
      </div>
      
      {/* Project Details Section */}
      {selectedProject && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{selectedProject.name} Details</h2>
            <div className="flex items-center">
              <div className="mr-4">
                <span className="text-sm text-gray-500">Overall Progress:</span>
                <span className="ml-2 text-lg font-bold">{selectedProject.progress}%</span>
              </div>
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Project Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm  font-medium">Total Tasks</h3>
              <p className="text-2xl font-bold ">{selectedProject.tasks}</p>
            </div>
            <div className=" p-4 rounded-lg border border-green-100">
              <h3 className="text-sm  font-medium">Completed Tasks</h3>
              <p className="text-2xl font-bold ">{selectedProject.completed}</p>
            </div>
            <div className="p-4 rounded-lg border border-red-100">
              <h3 className="text-sm font-medium">Bugs</h3>
              <p className="text-2xl font-bold ">{selectedProject.bugs}</p>
            </div>
            <div className=" p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm  font-medium">Test Cases</h3>
              <p className="text-2xl font-bold ">{selectedProject.tests}</p>
            </div>
          </div>
          
          {/* Tabs for Project Details */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex space-x-4">
              <button 
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('tasks')}
              >
                Tasks
              </button>
              <button 
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'bugs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('bugs')}
              >
                Bugs
              </button>
              <button 
                className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'tests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('tests')}
              >
                Tests
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="h-64">
            {activeTab === 'tasks' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Completed', value: selectedProject.completed, fill: '#10b981' },
                  { name: 'In Progress', value: selectedProject.tasks - selectedProject.completed, fill: '#f59e0b' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Tasks" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {activeTab === 'bugs' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Critical', value: Math.floor(selectedProject.bugs * 0.3), fill: '#ef4444' },
                  { name: 'Major', value: Math.floor(selectedProject.bugs * 0.5), fill: '#f97316' },
                  { name: 'Minor', value: selectedProject.bugs - Math.floor(selectedProject.bugs * 0.3) - Math.floor(selectedProject.bugs * 0.5), fill: '#f59e0b' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Bugs" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {activeTab === 'tests' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Passed', value: selectedProject.passed, fill: '#10b981' },
                  { name: 'Failed', value: selectedProject.tests - selectedProject.passed, fill: '#ef4444' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Tests" fill={(entry) => entry.fill} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalysis;