import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { viewDetailedProgressByAdmin, viewProgressByAdmin } from "../../../api/projectApi";

const ReportAnalysis = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await viewProgressByAdmin();
        const transformedData = response.data.map((project) => ({
          name: project.project_name,
          progress: project.progress,
          id: project.id,
          color: getProgressColor(project.progress)
        }));
        setProjectsData(transformedData);
      } catch (error) {
        console.error("Error fetching project progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProgressColor = (progress) => {
    if (progress < 30) return "#FF5252";
    if (progress < 70) return "#FFC107";
    return "#4CAF50";
  };

  const fetchDetailedData = async (projectId) => {
    setIsLoadingDetails(true);
    try {
      const data = await viewDetailedProgressByAdmin(projectId);
      setDetailedData(data);
    } catch (error) {
      console.error("Error fetching detailed project data:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchDetailedData(project.id);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const project = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow-md border border-gray-200 text-xs">
          <p className="font-bold">{project.name}</p>
          <p>Progress: <span className="font-medium">{project.progress}%</span></p>
          <p className="text-gray-500">Click to view details</p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#4CAF50", "#FFC107", "#FF5252", "#2196F3"];
  
  const prepareMetricsData = (metrics, metricType) => {
    if (!metrics || !metrics[metricType]) return [];
    
    const data = [];
    const metricData = metrics[metricType];
    
    if (metricType === "tasks") {
      data.push(
        { name: "Completed", value: metricData.completed },
        { name: "Pending", value: metricData.pending }
      );
    } else if (metricType === "modules") {
      data.push(
        { name: "Completed", value: metricData.completed },
        { name: "Pending", value: metricData.pending }
      );
    } else if (metricType === "test_cases") {
      data.push(
        { name: "Completed", value: metricData.completed },
        { name: "Failed", value: metricData.failed },
        { name: "Pending", value: metricData.pending }
      );
    }
    
    return data;
  };

  return (
    <div className="  rounded-lg ">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className=" rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Projects Progress Bar Chart */}
          <div className="bg-slate-200 p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Projects Progress Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={projectsData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#666', fontSize: 11 }}
                  axisLine={{ stroke: '#ccc' }}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "#666", fontSize: 11 }}
                  axisLine={{ stroke: "#ccc" }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ marginTop: 5 }} />
                <Bar 
                  dataKey="progress" 
                  name="Completion Progress"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  onClick={(data, index) => {
                    if (index >= 0 && index < projectsData.length) {
                      handleProjectSelect(projectsData[index]);
                    }
                  }}
                  cursor="pointer"
                  fillOpacity={0.8}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-1 text-center italic">
              Click on any bar to view project details
            </p>
          </div>

          {/* Streamlined Detailed View for Selected Project */}
          {selectedProject && (
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-700">
                  {selectedProject.name}: {detailedData?.overall_progress.toFixed(0)}% Complete
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 capitalize">
                  {detailedData?.project_status || "N/A"}
                </span>
              </div>
              
              {isLoadingDetails ? (
                <div className="flex justify-center items-center h-24">
                  <div className=" rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : detailedData ? (
                <div>
                  {/* Project Overview - Compact Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Tasks</p>
                      <p className="text-sm font-bold">
                        <span className="text-green-600">{detailedData.metrics.tasks.completed}</span>
                        <span className="text-xs text-gray-400"> / </span>
                        <span>{detailedData.metrics.tasks.total}</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Modules</p>
                      <p className="text-sm font-bold">
                        <span className="text-green-600">{detailedData.metrics.modules.completed}</span>
                        <span className="text-xs text-gray-400"> / </span>
                        <span>{detailedData.metrics.modules.total}</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Open Bugs</p>
                      <p className="text-sm font-bold text-red-600">
                        {detailedData.metrics.bugs.total}
                      </p>
                    </div>
                  </div>
                  
                  {/* Compact Progress Charts */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Tasks */}
                    <div className="border border-gray-100 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Tasks</h4>
                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareMetricsData(detailedData.metrics, "tasks")}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => 
                                `${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {prepareMetricsData(detailedData.metrics, "tasks").map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Modules */}
                    <div className="border border-gray-100 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Modules</h4>
                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareMetricsData(detailedData.metrics, "modules")}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => 
                                `${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {prepareMetricsData(detailedData.metrics, "modules").map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Test Cases */}
                    <div className="border border-gray-100 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Test Cases</h4>
                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareMetricsData(detailedData.metrics, "test_cases")}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => 
                                `${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {prepareMetricsData(detailedData.metrics, "test_cases").map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center mt-2 text-xs">
                    <div className="flex items-center mx-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center mx-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center mx-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Failed</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No detailed data available
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportAnalysis;