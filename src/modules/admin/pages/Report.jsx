import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { userCount } from '../../../api/userApi';

// Sample data - replace with your actual data source
const monthlyData = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 30 },
  { month: 'Mar', value: 25 },
  { month: 'Apr', value: 27 },
  { month: 'May', value: 30 },
  { month: 'Jun', value: 50 },
  { month: 'Jul', value: 35 },
  { month: 'Aug', value: 40 },
  { month: 'Sep', value: 45 },
  { month: 'Oct', value: 30 },
  { month: 'Nov', value: 25 },
  { month: 'Dec', value: 28 },
];

const projects = ['Project A', 'Project B', 'Project C', 'Project D'];
const teams = ['Development Team', 'QA Team', 'DevOps Team', 'UI/UX Team'];
const users = ['John Smith', 'Jane Doe', 'Alex Johnson', 'Maria Garcia'];

const Report = () => {
  const [activeTab, setActiveTab] = useState('project');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showDetails, setShowDetails] = useState(false);


const [userStats, setUserStats] = useState({
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0
});

useEffect(() => {
  const fetchUserCount = async () => {
    try {
      const response = await userCount();
      setUserStats({
        totalUsers: response.total,
        activeUsers: response.active,
        inactiveUsers: response.total - response.active
      });
    } catch (error) {
      console.error('Failed to fetch user count:', error);
      // Optional: Set default or error state
      setUserStats({
        totalUsers: 127,  // Fallback to existing value
        activeUsers: 100,
        inactiveUsers: 27
      });
    }
  };

  fetchUserCount();
}, []);

  // Stats would be fetched based on selection in a real app
  const stats = {
    totalTestCases: 245,
    tasks: 78,
    pending: 12,
    faults: 8,
    bugs: 15,
    developers: 6,
    testEngineers: 4
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setShowDetails(false);
  };

  const handleSelection = (value, type) => {
    if (type === 'project') setSelectedProject(value);
    if (type === 'team') setSelectedTeam(value);
    if (type === 'user') setSelectedUser(value);
    setShowDetails(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="container mx-auto p-4">
      
      <h2 className="text-lg font-semibold mb-2">User Analysis</h2>

      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'project' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('project')}
          >
            Project Wise
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'team' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('team')}
          >
            Team Wise
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'user' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('user')}
          >
            User Wise
          </button>
        </div>
        
        {activeTab === 'project' && (
          <div className="space-y-4">
            <select 
              className="w-full p-2 border rounded"
              value={selectedProject}
              onChange={(e) => handleSelection(e.target.value, 'project')}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            
            {selectedProject && (
              <ProjectAnalysis 
                project={selectedProject} 
                stats={stats} 
                showDetails={showDetails}
                toggleDetails={toggleDetails}
              />
            )}
          </div>
        )}
        
        {activeTab === 'team' && (
          <div className="space-y-4">
            <select 
              className="w-full p-2 border rounded"
              value={selectedTeam}
              onChange={(e) => handleSelection(e.target.value, 'team')}
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            
            {selectedTeam && (
              <TeamAnalysis 
                team={selectedTeam} 
                stats={stats} 
                showDetails={showDetails}
                toggleDetails={toggleDetails}
              />
            )}
          </div>
        )}
        
        {activeTab === 'user' && (
          <div className="space-y-4">
            <select 
              className="w-full p-2 border rounded"
              value={selectedUser}
              onChange={(e) => handleSelection(e.target.value, 'user')}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            
            {selectedUser && (
              <UserAnalysis 
                user={selectedUser} 
                stats={stats} 
                showDetails={showDetails}
                toggleDetails={toggleDetails}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Project Analysis Component
const ProjectAnalysis = ({ project, stats, showDetails, toggleDetails }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{project} Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard title="Test Cases" value={stats.totalTestCases} />
        <StatCard title="Tasks" value={stats.tasks} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Bugs" value={stats.bugs} />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="flex items-center px-4 py-2 border rounded hover:bg-gray-100"
          onClick={toggleDetails}
        >
          View Details
          {showDetails ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> : 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          }
        </button>
        <button className="flex items-center px-4 py-2 border rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <h4 className="font-semibold mb-2">Detailed Analysis</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Resources</h5>
              <ul className="list-disc pl-5">
                <li>Developers: {stats.developers}</li>
                <li>Test Engineers: {stats.testEngineers}</li>
                <li>Total Man Hours: 1,245</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Status</h5>
              <ul className="list-disc pl-5">
                <li>Completed Tasks: {stats.tasks - stats.pending}</li>
                <li>Pending Tasks: {stats.pending}</li>
                <li>Faults Identified: {stats.faults}</li>
                <li>Critical Bugs: {Math.floor(stats.bugs * 0.4)}</li>
                <li>Minor Bugs: {Math.floor(stats.bugs * 0.6)}</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Weekly Progress</h5>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Week 1', completed: 12, pending: 8 },
                  { month: 'Week 2', completed: 18, pending: 5 },
                  { month: 'Week 3', completed: 15, pending: 3 },
                  { month: 'Week 4', completed: 8, pending: 2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                  <Bar dataKey="pending" fill="#f87171" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// User Analysis Component
const UserAnalysis = ({ user, stats, showDetails, toggleDetails }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{user} Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard title="Assigned Tasks" value={12} />
        <StatCard title="Completed" value={9} />
        <StatCard title="Pending" value={3} />
        <StatCard title="Efficiency" value="85%" />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="flex items-center px-4 py-2 border rounded hover:bg-gray-100"
          onClick={toggleDetails}
        >
          View Details
          {showDetails ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> : 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          }
        </button>
        <button className="flex items-center px-4 py-2 border rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <h4 className="font-semibold mb-2">Individual Performance</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Skills & Role</h5>
              <ul className="list-disc pl-5">
                <li>Role: Senior Developer</li>
                <li>Primary Skills: React, Node.js</li>
                <li>Secondary Skills: AWS, Docker</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Performance Metrics</h5>
              <ul className="list-disc pl-5">
                <li>Average Task Completion: 1.8 days</li>
                <li>Code Quality Score: 94%</li>
                <li>Bug Rate: 0.5 per task</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Monthly Performance</h5>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Jan', tasks: 14, bugs: 3 },
                  { month: 'Feb', tasks: 12, bugs: 2 },
                  { month: 'Mar', tasks: 15, bugs: 1 },
                  { month: 'Apr', tasks: 10, bugs: 1 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#8b5cf6" name="Tasks Completed" />
                  <Bar dataKey="bugs" fill="#ef4444" name="Bugs Introduced" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow border text-center">
    <h4 className="text-sm text-gray-500 mb-1">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Report;






