
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../../redux/slices/projectSlice";
import CreateProject from "./CreateProject";

const ProjectManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [sortByNearestDue, setSortByNearestDue] = useState(false); // Sorting state

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

  if (showCreateProject) {
    return <CreateProject onBack={() => setShowCreateProject(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="relative w-80 items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search Projects..."
          className="w-full p-2 pl-10  bg-gray-100 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border-1 border-dashed border-gray-100 mx-auto rounded-lg w-full">
        <div className="justify-end flex gap-4 p-4">
          <select className="p-1 text-sm w-28 border border-gray-300 text-gray-700 rounded-md focus:outline-none">
            <option>Filter by</option>
          </select>
          
          {/* Sort by Nearest Due Date */}
          <button
            className="flex items-center gap-1 p-1 text-sm border border-gray-300 text-gray-700 rounded-md focus:outline-none"
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
            className="flex items-center gap-1 p-1 text-medium border font-serif text-white bg-yellow-500 rounded-md focus:outline-none"
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
    </tr>
  </thead>
  <tbody>
    {sortedProjects.map((project) => (
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
        <td className="p-2 text-center">{project.issues_count || "No Issues"}</td>
      </tr>
    ))}
  </tbody>
</table>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
