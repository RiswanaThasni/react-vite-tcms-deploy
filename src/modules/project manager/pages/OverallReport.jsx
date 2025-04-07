

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { viewProgressByAdmin } from "../../../api/projectApi";

ChartJS.register(ArcElement, Tooltip, Legend);

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
        const response = await viewProgressByAdmin();
        const transformedData = response.data.map((project) => ({
          name: project.project_name,
          progress: project.progress,
          id: project.project_id || project.id,
          status: project.status || getProjectStatus(project.progress)
        }));
        
        setProjectsData(transformedData);
        
        // Calculate project status counts based on API status field
        const counts = transformedData.reduce((acc, project) => {
          // Use the status directly from API or fallback to calculated one
          const status = project.status || getProjectStatus(project.progress);
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, { completed: 0, in_progress: 0, pending: 0 });
        
        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching project progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback function if status is not provided in API
  const getProjectStatus = (progress) => {
    if (progress >= 90) return "completed";
    if (progress >= 30) return "in_progress";
    return "pending";
  };

  // Prepare donut chart data with status labels mapped to display text
  const chartData = {
    labels: ["Completed  project", "In Progress project", "Pending  project    "],
    datasets: [
      {
        label: "Project Status",
        data: [
          statusCounts.completed || 0, 
          statusCounts.in_progress || 0, 
          statusCounts.pending || 0
        ],
        backgroundColor: ["#27FF14", "#FFEB14", "#F2A6A6"],
        borderColor: ["#27FF14", "#FFEB14", "#F2A6A6"],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 10  // Reduced font size
          },
          padding: 10  // Reduced padding
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'  // Slightly smaller cutout for better proportion in small container
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    const statusMap = {
      completed: "Completed",
      in_progress: "In Progress",
      pending: "Pending"
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full h-full p-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Project Status Overview</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          {/* Loading indicator could be added here */}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {/* Donut Chart - now smaller and more compact */}
          <div className="h-36 flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
          
          {/* Stats Cards - now more compact */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-green-500">
              <div className="flex justify-start items-center">
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-sm font-bold text-gray-800">{statusCounts.completed || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-yellow-500">
              <div className="justify-start items-center">
                <div>
                  <p className="text-xs text-gray-500">In Progress</p>
                  <p className="text-sm font-bold text-gray-800">{statusCounts.in_progress || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-red-500">
              <div className="flex justify-start items-center">
                <div>
                  <p className="text-xs text-gray-500">Pending </p>
                  <p className="text-sm font-bold text-gray-800">{statusCounts.pending || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-bold text-gray-800">{projectsData.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallReport;