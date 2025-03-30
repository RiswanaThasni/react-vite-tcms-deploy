import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListProjectByAdmin } from '../../../api/projectApi';
import randomColor from 'randomcolor'; // Import the randomcolor library

const ViewProject = () => {
  // State for storing projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectColors, setProjectColors] = useState({});

  // Initialize navigate hook for routing
  const navigate = useNavigate();

  // Fetch projects from backend using ListProjectByAdmin
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectData = await ListProjectByAdmin();
        setProjects(projectData);
        
        // Generate colors for each project when projects are loaded
        const colors = {};
        projectData.forEach(project => {
          // Generate a base color with randomcolor
          const baseColor = randomColor({
            luminosity: 'light', // 'light' ensures we get pastel-like colors
            hue: 'random'        // random hue for variety
          });
          
          colors[project.id] = baseColor;
        });
        
        setProjectColors(colors);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to handle navigation when a project is clicked
  const handleProjectClick = (projectId) => {
    navigate(`/admin_dashboard/project_details/${projectId}`);
  };

  // Function to generate a darker shade of a given color for accents
  const getDarkerShade = (color) => {
    // This is a simple function that darkens a hex color
    // Remove the # if it exists
    color = color.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Darken by reducing each component by 20%
    r = Math.floor(r * 0.8);
    g = Math.floor(g * 0.8);
    b = Math.floor(b * 0.8);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Function to determine if text should be dark or light based on background
  const getTextColor = (bgColor) => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance - formula commonly used to determine text color
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#333333' : '#ffffff';
  };


  const getProjectsByStatus = (status) => {
    return projects.filter(project => project.status.toLowerCase() === status.toLowerCase());
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className=""></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-200 rounded-lg text-white">
        <div className="text-red-400 text-xs font-medium">{error}</div>
        <button className="mt-3 px-3 py-1 text-white text-xs">
          Try Again
        </button>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const pendingProjects = getProjectsByStatus('pending');
  const completedProjects = getProjectsByStatus('completed');

  return (
    <div className='grid grid-cols-8'>
      <div className="p-4 col-span-6">
        {projects.length === 0 ? (
          <div className="text-center py-2 bg-gray-300 rounded-lg">
            <p className="text-gray-300 text-xs">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => {
              const baseColor = projectColors[project.id] || '#f8f9fa';
              const accentColor = getDarkerShade(baseColor);
              const textColor = getTextColor(baseColor);
              
              return (
                <div
                  key={project.id}
                  className="shadow-sm rounded-lg overflow-hidden cursor-pointer 
                            transition duration-200 hover:shadow-md border border-gray-100"
                  onClick={() => handleProjectClick(project.id)}
                  style={{ backgroundColor: baseColor }}
                >
                  {/* Card header with project ID and status */}
                  <div 
  className="px-3 py-2 flex items-center justify-between"
>
                    <h3 className="text-xs font-medium" style={{ color: textColor }}>
                      {project.project_id}
                    </h3>
                    <span 
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusStyle(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  
                  {/* Card body */}
                  <div className="p-3">
                    <div className="font-medium text-sm mb-2" style={{ color: textColor }}>
                      {project.project_name}
                    </div>
                    <p className="text-xs line-clamp-2 h-8" style={{ color: textColor }}>
                      {project.project_description}
                    </p>
                  </div>
                  
                  {/* Card footer with team members */}
                  <div 
  className="px-3 py-2 flex justify-end">
                    <div className="flex -space-x-2">
                      {project.project_team.map((member) => (
                        <img
                          key={member.id}
                          src={member.user_details.profile_picture || "/default.svg"}
                          alt={member.user_details.name}
                          className="w-6 h-6 rounded-full border border-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className='col-span-2 p-4 bg-slate-200 mt-4.5 rounded-lg'>
        {/* Projects sidebar organized by status - simplified to show only name and deadline */}
        <div className="space-y-4">
          {/* Pending Projects Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Projects Pending</h3>
            {pendingProjects.length === 0 ? (
              <p className="text-xs text-gray-500">No pending projects</p>
            ) : (
              <div className="space-y-2">
                {pendingProjects.map(project => (
                  <div 
                    key={project.id}
                    className="bg-white p-2 rounded shadow-sm cursor-pointer hover:bg-yellow-50 transition-colors"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <p className="text-xs font-medium text-gray-800">
                      {project.project_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Completed Projects Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Projects Completed</h3>
            {completedProjects.length === 0 ? (
              <p className="text-xs text-gray-500">No completed projects</p>
            ) : (
              <div className="space-y-2">
                {completedProjects.map(project => (
                  <div 
                    key={project.id}
                    className="bg-white p-2 rounded shadow-sm cursor-pointer hover:bg-green-50 transition-colors"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <p className="text-xs font-medium text-gray-800">
                      {project.project_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;