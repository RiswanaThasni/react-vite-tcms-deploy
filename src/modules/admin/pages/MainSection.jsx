import React, { useEffect, useState } from "react";
import { Search, BarChart2, Loader, AlertCircle, Calendar as LucideCalendar } from "lucide-react";
import { RecentActivityAdmin, SummaryCardsByAdmin } from "../../../api/projectApi";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState({
    summary: true,
    activities: true
  });
  const [error, setError] = useState({
    summary: null,
    activities: null
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchSummaryData();
    fetchRecentActivities();
  }, []);

  // Fetch summary cards data
  const fetchSummaryData = async () => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const data = await SummaryCardsByAdmin();
      
      // Format the data for project tab based on backend response
      const projectData = [
        { 
          label: "Total Projects", 
          count: data.total_projects, 
          className: "bg-card3",
          icon: <BarChart2 className="text-white" size={20} />
        },
        { 
          label: "Pending Projects", 
          count: data.pending_projects, 
          className: "bg-card4",
          icon: <BarChart2 className="text-white" size={20} />
        },
        { 
          label: "Completed Projects", 
          count: data.completed_projects, 
          className: "bg-card2",
          icon: <BarChart2 className="text-white" size={20} />
        },
      ];

      setSummaryData(projectData);
      setError(prev => ({ ...prev, summary: null }));
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError(prev => ({ ...prev, summary: "Failed to load summary data" }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Fetch recent activities data
  const fetchRecentActivities = async () => {
    try {
      setLoading(prev => ({ ...prev, activities: true }));
      const data = await RecentActivityAdmin();
      setRecentProjects(data);
      setError(prev => ({ ...prev, activities: null }));
    } catch (err) {
      console.error("Error fetching recent activities:", err);
      setError(prev => ({ ...prev, activities: "Failed to load recent activities" }));
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  // Filter projects based on search query
  const filteredProjects = recentProjects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Search Bar */}
      

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {loading.summary ? (
              <div className="col-span-3 flex justify-center p-4">
                {/* <Loader className="animate-spin text-indigo-600" size={24} /> */}
              </div>
            ) : error.summary ? (
              <div className="col-span-3 flex items-center justify-center p-4 bg-red-50 rounded text-red-600">
                {/* <AlertCircle className="mr-2" size={20} /> */}
                {error.summary}
              </div>
            ) : (
              summaryData.map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.className} p-4 rounded shadow-sm`}
                >
                  <h3 className="text-sm font-medium text-white">{item.label}</h3>
                  <p className="text-2xl font-bold text-white">{item.count}</p>
                </div>
              ))
            )}
          </div>
          <div className="mb-6 justify-end flex">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 bg-gray-100 rounded-md border border-gray-200"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

          {/* Recent Projects Table */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-medium mb-4">Recent Projects</h2>
            <div className="overflow-x-auto">
              {loading.activities ? (
                <div className="flex justify-center p-4">
                  {/* <Loader className="animate-spin text-indigo-600" size={24} /> */}
                </div>
              ) : error.activities ? (
                <div className="flex items-center justify-center p-4 bg-red-50 rounded text-red-600">
                  {/* <AlertCircle className="mr-2" size={20} /> */}
                  {error.activities}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Project ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Project Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project, index) => (
                        <tr 
                          key={project.id} 
                          className="bg-white hover:bg-blue-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.project_id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {project.project_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <div className="max-w-md truncate">
                              {project.project_description}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-3">
                          {searchQuery ? (
                            <div className="flex flex-col items-center py-2">
                              <Search size={20} className="text-gray-400 mb-2" />
                              <p>No projects found matching "{searchQuery}"</p>
                            </div>
                          ) : (
                            "No recent projects found."
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default MainSection;