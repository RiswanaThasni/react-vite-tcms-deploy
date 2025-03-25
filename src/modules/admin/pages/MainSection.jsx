import React, { useEffect, useState } from "react";
import { Search, BarChart2 } from "lucide-react";
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
          icon: <BarChart2 className="text-white" size={16} />
        },
        { 
          label: "Pending Projects", 
          count: data.pending_projects, 
          className: "bg-card4",
          icon: <BarChart2 className="text-white" size={16} />
        },
        { 
          label: "Completed Projects", 
          count: data.completed_projects, 
          className: "bg-card2",
          icon: <BarChart2 className="text-white" size={16} />
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
    <div className="p-2 md:p-4">
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            {loading.summary ? (
              <div className="col-span-3 flex justify-center p-2">
              </div>
            ) : error.summary ? (
              <div className="col-span-3 flex items-center justify-center p-2 bg-red-50 rounded text-red-600">
                {error.summary}
              </div>
            ) : (
              summaryData.map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.className} p-2 rounded shadow-sm`}
                >
                  <h3 className="text-xs font-medium text-white">{item.label}</h3>
                  <p className="text-lg font-bold text-white">{item.count}</p>
                </div>
              ))
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-4 justify-end flex">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search Projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-1.5 pl-8 text-sm bg-gray-100 rounded-md border border-gray-200"
              />
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Recent Projects Table */}
          <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
            <h2 className="text-base font-medium mb-2">Recent Projects</h2>
            <div>
              {loading.activities ? (
                <div className="flex justify-center p-2">
                </div>
              ) : error.activities ? (
                <div className="flex items-center justify-center p-2 bg-red-50 rounded text-red-600">
                  {error.activities}
                </div>
              ) : (
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Project ID
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Project Name
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
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
                          <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                            {project.project_id}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 font-medium">
                            {project.project_name}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500">
                            <div className="max-w-xs">
                              {project.project_description}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-2">
                          {searchQuery ? (
                            <div className="flex flex-col items-center py-1">
                              <Search size={16} className="text-gray-400 mb-1" />
                              <p className="text-xs">No projects found matching "{searchQuery}"</p>
                            </div>
                          ) : (
                            <p className="text-xs">No recent projects found.</p>
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