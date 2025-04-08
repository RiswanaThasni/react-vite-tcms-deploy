import React, { useState, useEffect } from "react";
import { fetchProjects } from "../../../api/projectApi";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const OverallReport = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    completed: 0,
    in_progress: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Using the fetchProjects API
        const data = await fetchProjects();
        const transformedData = data.map((project) => ({
          name: project.project_name,
          progress: project.progress,
          id: project.project_id || project.id,
          status: project.status
        }));
        
        setProjectsData(transformedData);
        
        // Calculate project status counts
        const counts = transformedData.reduce((acc, project) => {
          const status = project.status || "pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, { completed: 0, in_progress: 0, pending: 0 });
        
        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate percentages for visualization
  const totalProjects = projectsData.length;
  const percentages = {
    completed: totalProjects ? Math.round((statusCounts.completed / totalProjects) * 100) : 0,
    in_progress: totalProjects ? Math.round((statusCounts.in_progress / totalProjects) * 100) : 0,
    pending: totalProjects ? Math.round((statusCounts.pending / totalProjects) * 100) : 0
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full h-full">
      <h3 className="text-base font-semibold text-gray-700 p-2 border-b">Project Overview</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
        </div>
      ) : (
        <div className="p-3">
          {/* Visual representation using proportional blocks */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-full h-24 flex rounded-lg overflow-hidden">
              {statusCounts.completed > 0 && (
                <div 
                  className="bg-green-100 flex flex-col items-center justify-center border-r border-white"
                  style={{ width: `${percentages.completed}%` }}
                >
                  <CheckCircle size={20} className="text-green-600 mb-1" />
                  <span className="text-xs font-medium text-green-800">{percentages.completed}%</span>
                </div>
              )}
              
              {statusCounts.in_progress > 0 && (
                <div 
                  className="bg-yellow-100 flex flex-col items-center justify-center border-r border-white"
                  style={{ width: `${percentages.in_progress}%` }}
                >
                  <Clock size={20} className="text-yellow-600 mb-1" />
                  <span className="text-xs font-medium text-yellow-800">{percentages.in_progress}%</span>
                </div>
              )}
              
              {statusCounts.pending > 0 && (
                <div 
                  className="bg-red-100 flex flex-col items-center justify-center"
                  style={{ width: `${percentages.pending}%` }}
                >
                  <AlertCircle size={20} className="text-red-600 mb-1" />
                  <span className="text-xs font-medium text-red-800">{percentages.pending}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Status detail cards with progress bars */}
          <div className="space-y-3">
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-2" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="text-sm font-bold">{statusCounts.completed} projects</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${percentages.completed}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Clock size={16} className="text-yellow-600 mr-2" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <span className="text-sm font-bold">{statusCounts.in_progress} projects</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 rounded-full h-2"
                  style={{ width: `${percentages.in_progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <AlertCircle size={16} className="text-red-600 mr-2" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="text-sm font-bold">{statusCounts.pending} projects</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 rounded-full h-2"
                  style={{ width: `${percentages.pending}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Summary footer */}
          <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total Projects</span>
            <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {totalProjects}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallReport;