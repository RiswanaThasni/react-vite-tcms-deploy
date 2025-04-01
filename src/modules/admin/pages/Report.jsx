
import React, { useEffect, useState } from 'react';
import { ListProjectAdmin, ProjectDetailsforAnalysis, ProjectSummary } from '../../../api/projectApi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchUserDetails, fetchUsers } from '../../../api/userApi';
import UserReportBar from './UserReportBar'

const Report = () => {
  const [activeTab, setActiveTab] = useState('project');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showDetails, setShowDetails] = useState(false);


  const [projects, setProjects] = useState([]);
  const [projectSummary, setProjectSummary] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);


  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  
  // Add state for user details
  const [userDetails, setUserDetails] = useState(null);
  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);



  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ListProjectAdmin();
        console.log("Full response:", response);
        
        // Check if response exists and has data property
        if (response && response.data) {
          setProjects(response.data);
        } else {
          // If response exists but no data property
          setProjects([]);
          setError("No project data received from API");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);
  
  // Fetch project summary when a project is selected
  useEffect(() => {
    const fetchProjectSummary = async () => {
      if (!selectedProject) {
        setProjectSummary(null);
        return;
      }
      
      setIsSummaryLoading(true);
      setSummaryError(null);
      setProjectDetails(null); // Reset details when new project is selected
      setShowDetails(false); // Reset showDetails state
      try {
        const response = await ProjectSummary(selectedProject);
        console.log("Project summary response:", response);
        
        if (response && response.data) {
          setProjectSummary(response.data);
        } else {
          setProjectSummary(null);
          setSummaryError("No summary data received from API");
        }
      } catch (error) {
        console.error("Error fetching project summary:", error);
        setSummaryError("Failed to load project summary. Please try again.");
        setProjectSummary(null);
      } finally {
        setIsSummaryLoading(false);
      }
    };
    
    fetchProjectSummary();
  }, [selectedProject]);
  


  useEffect(() => {
    const getUsersList = async () => {
      setIsUsersLoading(true);
      setUsersError(null);
      try {
        const userData = await fetchUsers();
        console.log("Users data:", userData);
        setUsers(userData || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsersError("Failed to load users. Please try again.");
        setUsers([]);
      } finally {
        setIsUsersLoading(false);
      }
    };

    // Only fetch users when user tab is active
    if (activeTab === 'user') {
      getUsersList();
    }
  }, [activeTab]);
  
  // New effect to fetch user details when a user is selected
  useEffect(() => {
    const getUserDetails = async () => {
      if (!selectedUser) {
        setUserDetails(null);
        return;
      }
      
      setIsUserDetailsLoading(true);
      setUserDetailsError(null);
      setShowDetails(false); // Reset showDetails state
      
      try {
        const response = await fetchUserDetails(selectedUser);
        console.log("User details response:", response);
        
        if (response && response.data) {
          setUserDetails(response.data);
        } else {
          setUserDetails(null);
          setUserDetailsError("No user details received from API");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetailsError("Failed to load user details. Please try again.");
        setUserDetails(null);
      } finally {
        setIsUserDetailsLoading(false);
      }
    };
    
    getUserDetails();
  }, [selectedUser]);



  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
    setShowDetails(false);
  };

  const [filters, setFilters] = useState({
    project: '',
    user: '',
    team: '',
  });
  
  const handleSelection = (value, type) => {
    if (type === 'project') {
      setSelectedProject(value);
    } else if (type === 'user') {
      setSelectedUser(value);
    } 
    setFilters((prev) => ({ ...prev, [type]: value }));
  };
  
  const fetchProjectDetails = async (projectId) => {
    if (!projectId) return;
    
    setIsDetailsLoading(true);
    setDetailsError(null);
    
    try {
      const response = await ProjectDetailsforAnalysis(projectId);
      console.log("Project details response:", response);
      
      if (response && response.data) {
        setProjectDetails(response.data);
        setShowDetails(true);
      } else {
        setProjectDetails(null);
        setDetailsError("No detailed data received from API");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setDetailsError("Failed to load project details. Please try again.");
      setProjectDetails(null);
    } finally {
      setIsDetailsLoading(false);
    }
  };
  
  const toggleDetails = () => {
    if (showDetails) {
      // If details are already shown, just hide them
      setShowDetails(false);
    } else if (activeTab === 'project' && selectedProject && !projectDetails) {
      // If project details aren't loaded yet, fetch them
      fetchProjectDetails(selectedProject);
    } else {
      // If details are already loaded, just show them
      setShowDetails(true);
    }
  };

  const getProjectOptions = () => {
    if (!projects || projects.length === 0) return [];
    
    return projects.map(project => ({
      id: project.id || '',
      name: project.project_name || 'Unknown Project'
    }));
  };

  const projectOptions = getProjectOptions();

  return (
    <div className="container p-4 mx-auto ">
      
      <h2 className="text-lg font-semibold mb-2">User Analysis</h2>
<UserReportBar/>   
   <h2 className="text-lg font-semibold mb-2"> Analysis</h2>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex  mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'project' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => handleTabChange('project')}
          >
            Project Wise
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
            {isLoading ? (
              <p>Loading projects...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <select 
                className="w-full p-2 bg-gray-100 rounded"
                value={selectedProject}
                onChange={(e) => handleSelection(e.target.value, 'project')}
              >
                <option value="">Select Project</option>
                {projectOptions.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
            
            {isSummaryLoading ? (
              <p>Loading project summary...</p>
            ) : summaryError ? (
              <p className="text-red-500">{summaryError}</p>
            ) : selectedProject && projectSummary ? (
              <ProjectAnalysis 
                project={projectSummary.project_name} 
                summary={projectSummary}
                showDetails={showDetails}
                toggleDetails={toggleDetails}
                projectDetails={projectDetails}
                isDetailsLoading={isDetailsLoading}
                detailsError={detailsError}
              />
            ) : selectedProject ? (
              <p>No summary data available for this project.</p>
            ) : null}
          </div>
        )}
        
       {activeTab === 'user' && (
        <div className="space-y-4">
          {isUsersLoading ? (
            <p>Loading users...</p>
          ) : usersError ? (
            <p className="text-red-500">{usersError}</p>
          ) : (
            <select 
              className="w-full p-2 bg-gray-100 rounded"
              value={selectedUser}
              onChange={(e) => handleSelection(e.target.value, 'user')}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || `${user.first_name} ${user.last_name}`} ({user.role})
                </option>
              ))}
            </select>
          )}
          
          {isUserDetailsLoading ? (
            <p>Loading user details...</p>
          ) : userDetailsError ? (
            <p className="text-red-500">{userDetailsError}</p>
          ) : selectedUser ? (
            <UserAnalysis 
              user={users.find(u => u.id.toString() === selectedUser.toString())} 
              userDetails={userDetails}
              showDetails={showDetails}
              toggleDetails={toggleDetails}
              isLoading={isUserDetailsLoading}
            />
          ) : null}
        </div>
      )}
      </div>
    </div>
  );
};

// Project Analysis Component with dynamic data and details
const ProjectAnalysis = ({ project, summary, showDetails, toggleDetails, projectDetails, isDetailsLoading, detailsError }) => {
  // Calculate completed tasks based on progress
  const completedTasks = Math.floor(summary.total_tasks * (summary.progress / 100));
  const pendingTasks = summary.total_tasks - completedTasks;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{project} </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard title="Test Cases" value={summary.total_test_cases} color="purple" />
        <StatCard title="Tasks" value={summary.total_tasks} color="blue" />
        <StatCard title="Pending" value={pendingTasks} color="yellow" />
        <StatCard title="Bugs" value={summary.total_bugs} color="red" />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="flex items-center px-4 py-2 bg-sidebar-hover rounded hover:bg-lime-400"
          onClick={toggleDetails}
          disabled={isDetailsLoading}
        >
          {isDetailsLoading ? 'Loading...' : 'View Details'}
          {isDetailsLoading ? null : (
            showDetails ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </button>
        <button className="flex items-center px-4 py-2 bg-sidebar-hover rounded hover:bg-lime-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>
      
      {detailsError && <p className="text-red-500 mt-4">{detailsError}</p>}
      
      {showDetails && projectDetails && (
        <div className="mt-4 p-4 bg-white rounded-lg ">
          <h4 className="font-semibold mb-2">Detailed Analysis</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Project Overview</h5>
              <ul className="list-disc pl-5">
                <li>Project ID: {projectDetails.project_id}</li>
                <li>Project Lead: {projectDetails.project_lead}</li>
                <li>Overall Progress: {projectDetails.overall_progress.toFixed(1)}%</li>
                <li>Total Modules: {projectDetails.modules.length}</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Team Members</h5>
              <ul className="list-disc pl-5">
                {projectDetails.team.map((member, index) => (
                  <li key={index}>{member.full_name} - {member.role}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Modules</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white ">
                <thead>
                  <tr>
                    <th className="py-2 px-3 border-b text-left">ID</th>
                    <th className="py-2 px-3 border-b text-left">Name</th>
                    <th className="py-2 px-3 border-b text-left">Priority</th>
                    <th className="py-2 px-3 border-b text-left">Status</th>
                    <th className="py-2 px-3 border-b text-left">Progress</th>
                    <th className="py-2 px-3 border-b text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projectDetails.modules.map((module, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-3 border-b">{module.Module_id}</td>
                      <td className="py-2 px-3 border-b">{module.module_name}</td>
                      <td className="py-2 px-3 border-b">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          module.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          module.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {module.priority}
                        </span>
                      </td>
                      <td className="py-2 px-3 border-b">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          module.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {module.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 border-b">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{module.progress}%</span>
                      </td>
                      <td className="py-2 px-3 border-b">{new Date(module.due_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Bug Summary</h5>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard title="Total Bugs" value={projectDetails.bug_summary.faults_identified} color="blue"/>
              <StatCard title="Critical" value={projectDetails.bug_summary.critical_bugs} color="red"/>
              <StatCard title="Major" value={projectDetails.bug_summary.major_bugs} color="orange"/>
              <StatCard title="Minor" value={projectDetails.bug_summary.minor_bugs} color="yellow"/>
              <StatCard title="Trivial" value={projectDetails.bug_summary.trivial_bugs} color="green"/>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Weekly Progress</h5>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectDetails.weekly_progress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#60a5fa" name="Progress (%)" />
                  <Bar dataKey="tasks_completed" fill="#4ade80" name="Tasks Completed" />
                  <Bar dataKey="modules_completed" fill="#8b5cf6" name="Modules Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated User Analysis Component
const UserAnalysis = ({ user, userDetails, showDetails, toggleDetails, isLoading }) => {
  // Only proceed if user is defined
  if (!user) return null;
  
  // Calculate current stats based on userDetails if available
  const currentMonth = userDetails?.monthly_performance?.length > 0 ? 
    userDetails.monthly_performance[userDetails.monthly_performance.length - 1] : null;
  
  // Calculate efficiency as a percentage
  const calculateEfficiency = () => {
    if (!currentMonth) return "0%";
    if (currentMonth.total === 0) return "0%";
    return `${currentMonth.efficiency}%`;
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{user.name || `${user.first_name} ${user.last_name}`} </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard 
          title="Assigned Tasks" 
          value={currentMonth ? currentMonth.total : 0} 
          color="blue"
        />
        <StatCard 
          title="Completed" 
          value={currentMonth ? currentMonth.completed : 0} 
          color="green"
        />
        <StatCard 
          title="Pending" 
          value={currentMonth ? (currentMonth.total - currentMonth.completed) : 0} 
          color="yellow"
        />
        <StatCard 
          title="Efficiency" 
          value={calculateEfficiency()} 
          color="purple"
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          className="flex items-center px-4 py-2  bg-sidebar-hover rounded hover:bg-gray-100"
          onClick={toggleDetails}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'View Details'}
          {isLoading ? null : (
            showDetails ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </button>
        <button className="flex items-center px-4 py-2  bg-sidebar-hover rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>
      
      {showDetails && userDetails && (
        <div className="mt-4 p-4 bg-white rounded-lg ">
        {user.profile_picture && (
            <div className="mt-4 p-4">
              <h5 className="font-medium mb-2">Profile Picture</h5>
              <img 
                src={user.profile_picture} 
                alt={`${user.name || user.first_name}'s profile`} 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}
          <h4 className="font-semibold mb-2">Individual Performance</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Skills & Role</h5>
              <ul className="list-disc pl-5">
                <li>Role: {userDetails.user_details.role || 'N/A'}</li>
                <li>Full Name: {userDetails.user_details.full_name || 'N/A'}</li>
                <li>Specialization: {userDetails.user_details.specialization || 'N/A'}</li>
                <li>Status: {userDetails.user_details.status || 'N/A'}</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Contact Information</h5>
              <ul className="list-disc pl-5">
                <li>Email: {userDetails.user_details.email || 'N/A'}</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium mb-2">Monthly Performance</h5>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userDetails.monthly_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8b5cf6" name="Total Tasks" />
                  <Bar dataKey="completed" fill="#4ade80" name="Completed Tasks" />
                  <Bar dataKey="efficiency" fill="#60a5fa" name="Efficiency (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card Component - Updated with color support and no border
const StatCard = ({ title, value, color = "blue" }) => {
  // Define color variants 
  const colorVariants = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800"
  };
  
  return (
    <div className={`p-4 rounded-lg shadow ${colorVariants[color] || colorVariants.blue} text-center`}>
      <h4 className="text-sm opacity-80 mb-1">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Report;