
import React, { useEffect, useState } from 'react';
import { Calendar, Search, MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../../redux/slices/projectSlice'
import randomColor from 'randomcolor'; 
import OverallReport from './OverallReport';



const PmMainSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const [projectColors, setProjectColors] = useState({});
  
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
  dispatch(getProjects());
}, [dispatch]);

useEffect(() => {
    if (projects && projects.length > 0) {
      const colors = {};
      projects.forEach(project => {
        // Generate a base color with randomcolor
        const baseColor = randomColor({
          luminosity: 'light', // 'light' ensures we get pastel-like colors
          hue: 'random'        // random hue for variety
        });
        
        colors[project.id] = baseColor;
      });
      
      setProjectColors(colors);
    }
  }, [projects]);

  const getDarkerShade = (color) => {
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
    <div >
    <div className="relative w-80 items-center ">
          <input type="text" placeholder="Search Projects" className="w-full p-2 pl-10 bg-white rounded-md" />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      {/* Search Bar */}

      <div className='p-1 md:p-3 grid grid-cols-8 gap-6'>
      <div className="flex flex-col col-span-6 lg:flex-row gap-3">
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-4">Active Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {projects.map((project) => {
                // Get the color for this project
                const baseColor = projectColors[project.id] || '#f8f9fa';
                const textColor = getTextColor(baseColor);
                
                return (
                  <div
                    key={project.id}
                    className="p-3 rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow text-sm"
                    onClick={() => handleProjectClick(project.id)}
                    style={{ backgroundColor: baseColor }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm" style={{ color: textColor }}>{project.project_name}</h3>
                      <MoreHorizontal size={16} style={{ color: textColor }} />
                    </div>
                    <p className="text-xs" style={{ color: textColor }}>{project.project_description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3 p-1">
                      <div className="flex justify-between text-xs mb-1" style={{ color: textColor }}>
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-opacity-30 rounded-full h-1.5" style={{ backgroundColor: getDarkerShade(baseColor) }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ 
                            width: `${project.progress}%`, 
                            backgroundColor: project.progress < 30 ? "#ef4444" : 
                                           project.progress < 70 ? "#eab308" : "#22c55e"
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Due Date & Team Members */}
                    <div className="flex items-center justify-between text-xs" style={{ color: textColor }}>
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
                          <span style={{ color: textColor }}>No Assignees</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      <div className='col-span-2  rounded-lg p-4  bg-slate-200  '>
<OverallReport/>
<div className='rounded-lg p-4  bg-slate-200 '>

</div>
        </div>
        
      </div>
      

      
    </div>
  );
};

export default PmMainSection;
