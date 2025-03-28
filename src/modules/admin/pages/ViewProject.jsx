import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListProjectByAdmin } from '../../../api/projectApi';

const ViewProject = () => {
  // State for storing projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize navigate hook for routing
  const navigate = useNavigate();

  // Fetch projects from backend using ListProjectByAdmin
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectData = await ListProjectByAdmin();
        setProjects(projectData);
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

  return (
    <div className="bg-white">
      {projects.length === 0 ? (
        <div className="text-center py-2 bg-gray-300 rounded-lg">
          <p className="text-gray-300 text-xs">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.map((project) => (
            <div
  key={project.id}
  className="bg-gray-100 p-3 rounded-md cursor-pointer relative 
             transition duration-200 hover:bg-gray-200 hover:shadow-md"
  onClick={() => handleProjectClick(project.id)}
>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-custom1">{project.project_id}</h3>
                <div className="text-xs font-semibold text-gray-700">
                <span 
                  className={`inline-block px-2 py-1 text-xs rounded ${getStatusStyle(project.status)}`}
                >
                  {project.status}
                </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="inline-block px-2 py-0.5 rounded-full font-medium text-xs text-custom1">
                  {project.project_name}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-00 bg-opacity-40 rounded text-xs">
                <p className="text-custom1 text-xs line-clamp-2">{project.project_description}</p>
              </div>
              
              {/* Profile images positioned at the right bottom corner */}
              <div className="absolute bottom-2 right-2 mt-3 flex -space-x-2">
              {project.project_team.map((member) => (
                  <img
                    key={member.id}
                    src={member.user_details.profile_picture || "/default.svg"}
                    alt={member.user_details.name}
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProject;