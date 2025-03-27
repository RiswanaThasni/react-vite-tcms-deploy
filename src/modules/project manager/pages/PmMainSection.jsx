
import React, { useEffect } from 'react';
import { Calendar, Search, MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../../redux/slices/projectSlice'

const PmMainSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
  dispatch(getProjects());
}, [dispatch]);



  const handleProjectClick = (projectId) => {
    navigate(`/projectmanager_dashboard/project_details/${projectId}`);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return projects
      .map((project) => {
        const dueDate = new Date(project.dueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return { ...project, daysRemaining: diffDays };
      })
      .filter((project) => project.daysRemaining > 0 && project.daysRemaining <= 14)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="">
      {/* Search Bar */}
      <div className="mb-2 flex items-center">
        <div className="relative w-80 items-center mb-2">
          <input type="text" placeholder="Search Projects" className="w-full p-2 pl-10 bg-gray-50 rounded-md" />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-4">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
  {projects.map((project) => (
    <div
      key={project.id}
      className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow text-sm"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-700 text-sm">{project.project_name}</h3>
        <MoreHorizontal size={16} className="text-gray-400" />
      </div>
      <p className="text-gray-600 text-xs">{project.project_description}</p>

      {/* Progress Bar */}
      <div className="mb-3 p-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${
              project.progress < 30
                ? "bg-red-500"
                : project.progress < 70
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Due Date & Team Members */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Due date: {new Date(project.deadline).toLocaleDateString()}</span>

        {/* Team Members */}
        <div className="flex -space-x-2">
          {project.project_team?.length > 0 ? (
            project.project_team.map((teamMember, index) => (
              <img
                key={index}
                src={teamMember.user_details?.profile_picture || "/default-avatar.png"}
                alt="Assignee"
                className="w-6 h-6 rounded-full border-2 border-white object-cover bg-gray-200"
              />
            ))
          ) : (
            <span className="text-gray-500">No Assignees</span>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </div>
  );
};

export default PmMainSection;
