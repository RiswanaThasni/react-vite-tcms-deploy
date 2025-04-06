import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight, ChevronUp, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../../redux/slices/projectSlice";
import CreateProject from "./CreateProject";
import { deleteProject, editProject, restoreProject } from "../../../api/projectApi";
import EditProject from "./EditProject";



const ProjectManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [sortByNearestDue, setSortByNearestDue] = useState(false); // Sorting state
  const [showEditProject, setShowEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);

  // Get projects from Redux store
  const { projects, loading, error } = useSelector((state) => state.projects);

  // Fetch projects when component mounts
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(getProjects(token));
    }
  }, [dispatch]);

  const handleRowClick = (projectId) => {
    navigate(`/projectmanager_dashboard/project_details/${projectId}`);
  };
  

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-red-400";
      default:
        return "bg-gray-500";
    }
  };

  // Filter projects based on search input
  const filteredProjects = (projects || []).filter((project) =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  // Sort projects by nearest due date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortByNearestDue) return 0; // No sorting if button is not clicked
    return new Date(a.deadline) - new Date(b.deadline); // Sort ascending by deadline
  });

  // Calculate pagination indexes
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < Math.ceil(sortedProjects.length / projectsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (showCreateProject) {
    return <CreateProject onBack={() => setShowCreateProject(false)} />;
  }
  if (showEditProject && selectedProject) {
    return <EditProject 
      project={selectedProject} 
      onBack={() => {
        setShowEditProject(false);
        setSelectedProject(null);
      }} 
    />;
  }

  const handleEditProject = (e, project) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedProject(project);
    setShowEditProject(true);
  };


  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation(); // Prevent row click event
    try {
      if (window.confirm("Are you sure you want to archive this project?")) {
        await deleteProject(projectId);
        // Refresh projects list after deletion
        const token = localStorage.getItem("access_token");
        if (token) {
          dispatch(getProjects(token));
        }
      }
    } catch (error) {
      console.error("Error archiving project:", error);
      alert("Failed to archive project. Please try again.");
    }
  };


  const handleRestoreProject = async (e, projectId) => {
    e.stopPropagation(); // Prevent row click event
    try {
      if (window.confirm("Are you sure you want to restore this project?")) {
        await restoreProject(projectId);
        // Refresh projects list after restoration
        const token = localStorage.getItem("access_token");
        if (token) {
          dispatch(getProjects(token));
        }
        alert("Project restored successfully.");
      }
    } catch (error) {
      console.error("Error restoring project:", error);
      alert("Failed to restore project. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-mainsection">
      {/* Search Bar */}
      <div className="relative w-80 items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search Projects..."
          className="w-full p-2 pl-10  bg-white rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-slate-200 rounded-lg">
      <div className="border-1 border-dashed border-gray-100 mx-auto rounded-lg w-full">
        <div className="justify-end flex gap-4 p-4">
          
          
          {/* Sort by Nearest Due Date */}
          <button
            className="flex items-center gap-1 p-1 text-sm border bg-white border-gray-300 text-gray-700 rounded-md focus:outline-none"
            onClick={() => setSortByNearestDue(!sortByNearestDue)}
          >
            <span>Nearest Due Date</span>
            <div className="flex flex-col">
              <ChevronUp size={14} className={`text-gray-500 ${sortByNearestDue ? "text-black" : ""}`} />
              <ChevronDown size={14} className="text-gray-500 -mt-1" />
            </div>
          </button>

          {/* Create Project Button */}
          <button
            className="flex items-center gap-1 p-1 text-medium  font-serif text-white bg-sidebar-hover rounded-md focus:outline-none"
            onClick={() => setShowCreateProject(true)}
          >
            <span>+ </span> Create Project
          </button>
        </div>

        <hr className="border-dashed border-gray-300 mt-2 mx-auto" />

        <div className="mt-3 p-3">
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            {loading ? (
              <p className="text-center p-4">Loading projects...</p>
            ) : error ? (
              <p className="text-center p-4 text-red-500">Error: {error}</p>
            ) : (
              <>
                <table className="w-full border-collapse rounded-lg text-sm">
                  <thead className="bg-gray-100 border-b border-gray-300 font-light text-xs">
                    <tr className="text-left text-gray-600">
                      <th className="p-2">Project ID</th>
                      <th className="p-2">Project Name</th>
                      <th className="p-2">Owner</th>
                      <th className="p-2">Assignees</th>
                      <th className="p-2">Progress</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Start Date</th>
                      <th className="p-2">End Date</th>
                      <th className="p-2">Issues</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProjects.map((project) => (
                      <tr key={project.project_id} className="text-gray-700 bg-white hover:bg-gray-100 transition border-b border-gray-300 text-xs"
                      onClick={() => handleRowClick(project.id)}>
                        <td className="p-2">{project.project_id}</td>
                        <td className="p-2">{project.project_name}</td>
                        <td className="p-2">{project.project_lead?.name || "N/A"}</td>

                        {/* Assignee Profile Pictures */}
                        <td className="p-2">
                          <div className="flex -space-x-1">
                            {project.project_team?.length > 0 ? (
                              project.project_team.map((teamMember, index) => (
                                <img
                                  key={index}
                                  src={teamMember.user_details?.profile_picture || "/default-avatar.png"}
                                  alt="Assignee"
                                  className="w-6 h-6 rounded-full border border-white object-cover bg-gray-200"
                                />
                              ))
                            ) : (
                              <span className="text-gray-500">No Assignees</span>
                            )}
                          </div>
                        </td>

                        <td className="p-2">
                          <div className="relative w-16 h-1.5 bg-gray-300 rounded">
                            <div
                              className={`absolute h-1.5 rounded ${getStatusColor(project.status)}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className={`px-1 py-0.5 text-white text-xs rounded-md ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-2">{project.created_at.split("T")[0]}</td>
                        <td className="p-2">{project.deadline}</td>
                        <td className="p-2 text-center">{project.bugs_count || "No Issues"}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => handleEditProject(e, project)}
                              className="text-blue-500 hover:text-blue-700 focus:outline-none"
                              title="Edit Project"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(e, project.id || project.project_id)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                              title="Archive Project"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={(e) => handleRestoreProject(e, project.id || project.project_id)}
                              className="text-green-500 hover:text-green-700 focus:outline-none"
                              title="Restore Project"
                            >
                              <RefreshCw size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-4 border-t border-gray-300">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, sortedProjects.length)} of {sortedProjects.length} projects
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded ${
                        currentPage === 1 
                          ? ' text-gray-500 cursor-not-allowed' 
                          : 'bg-sidebar-hover text-white hover:bg-blue-700'
                      }`}
                    >
                    <ChevronsLeft size={16} />
                    </button>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage >= Math.ceil(sortedProjects.length / projectsPerPage)}
                      className={`px-4 py-2 rounded ${
                        currentPage >= Math.ceil(sortedProjects.length / projectsPerPage)
                          ? ' text-gray-500 cursor-not-allowed'
                          : 'bg-sidebar-hover text-white hover:bg-blue-700'
                      }`}
                    ><ChevronsRight size={16} />
                      
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
