import { ChevronLeft, UsersIcon, FolderIcon, CalendarIcon, BarChart2Icon } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewProject } from "../../../api/projectApi";
import { fetchTasksByModule } from '../../../redux/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';



const AdminProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const  dispatch = useDispatch()


  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);


  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await viewProject(projectId);
        console.log("Project Data:", response.data)
        setProject(response.data);
      } catch (err) {
        setError(err.message || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleBackClick = () => {
    navigate("/admin_dashboard/overview");
  };


  const handleModuleClick = (moduleId) => {
    setSelectedModuleId(moduleId);
    dispatch(fetchTasksByModule(moduleId));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-500 bg-yellow-50';
      case 'completed': return 'text-green-500 bg-green-50';
      case 'in-progress': return 'text-blue-500 bg-blue-50';
      default: return 'text-red-500 bg-red-50';
    }
  };

 

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center  text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={14} />
        <span className="text-sm">Back to Projects</span>
      </button>

      {project ? (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Project Overview */}
          <div className="md:col-span-2 bg-gray-50  rounded-md  p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{project.project_name}</h2>
              <p className="text-gray-600 mb-4">{project.project_description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="text-gray-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-semibold">{project.deadline}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BarChart2Icon className="text-gray-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{project.progress}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Team */}
          <div className="bg-gray-50 rounded-md p-6">
            <div className="flex items-center mb-4">
              <UsersIcon className="mr-2 text-gray-500" size={24} />
              <h3 className="text-sm font-semibold text-gray-800">Project Team</h3>
            </div>
            <div className="space-y-3">
             <p className="p-2 text-sm font-semibold text-gray-800 mb-2">
             <span className="text-gray-800">{project.project_lead.name}</span> <br />
             <span className="text-gray-500 text-sm">{project.project_lead.role}</span>    
                      </p>


              {project.project_team.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                >                 

                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {member.user_details.name.charAt(0)}
                    </span>
                  </div>
                  <div>            

                    <p className="text-sm font-medium text-gray-800">{member.user_details.name}</p>
                    <p className="text-sm text-gray-500">{member.user_details.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="md:col-span-3 bg-gray-50  rounded-md p-6">
            <div className="flex items-center mb-4">
              <FolderIcon className="mr-2 text-gray-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">Project Modules</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {project.modules.map((module) => (
                <div 
                  key={module.id} 
                  className="bg-white p-4 rounded-md "
                  onClick={() => handleModuleClick(module.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{module.module_name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${module.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        module.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {module.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{module.module_description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedModuleId && (
            <div className="md:col-span-3 bg-gray-50 rounded-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tasks for Selected Module</h3>
              {tasksLoading ? (
                <p className="text-gray-500">Loading tasks...</p>
              ) : tasks.length > 0 ? (
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li key={task.id} className="p-4 bg-white rounded-md shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">{task.task_name}</h4>
                      <p className="text-gray-600 text-sm">{task.task_description}</p>
                      <p className="text-sm text-gray-500"><strong>Assigned To:</strong> {task.assigned_to_name}</p>
                      <p className="text-sm text-gray-500"><strong>Status:</strong> {task.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No tasks available for this module.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">No project details found.</p>
      )}
    </div>
  );
};

export default AdminProjectDetails;