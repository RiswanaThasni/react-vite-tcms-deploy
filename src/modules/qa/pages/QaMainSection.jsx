import React, { useEffect, useState } from 'react';
import { Calendar as LucideCalendar, Search } from 'lucide-react';
import Calendar from "react-calendar"; 
import { QaRecentActivity, QasummaryCard, QaUpComingDue } from '../../../api/testApi';
import randomColor from 'randomcolor';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const QaMainSection = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [summary, setSummary] = useState({
    total_test_cases: 0,
    completed_test_cases: 0,
    pending_test_cases: 0,
    passed_test_cases:0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);
  const [dueDates, setDueDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [cardColors, setCardColors] = useState({
    total: '#f8f9fa',
    completed: '#f8f9fa',
    pending: '#f8f9fa',
    
  });

  // Function to generate a darker shade for text contrast
  const getTextColor = (bgColor) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#333333' : '#ffffff';
  };
  
  useEffect(() => {
    // Generate colors for cards
    const totalColor = randomColor({ luminosity: 'light', hue: 'blue' });
    const completedColor = randomColor({ luminosity: 'light', hue: 'green' });
    const pendingColor = randomColor({ luminosity: 'light', hue: 'orange' });
    
    setCardColors({
      total: totalColor,
      completed: completedColor,
      pending: pendingColor
    });
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await QasummaryCard();
        setSummary({
          total_test_cases: data.total || 0,
          completed_test_cases: data.completed || 0,
          pending_test_cases: data.assigned || 0,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    const fetchRecentActivities = async () => {
      try {
        setActivityLoading(true);
        const data = await QaRecentActivity();
        setRecentActivities(data || []);
        setActivityLoading(false);
      } catch (err) {
        setActivityError(err.message);
        setActivityLoading(false);
      }
    };
    
    const fetchUpcomingDue = async () => {
      try {
        const data = await QaUpComingDue();
        setDueDates(data || []);
      } catch (err) {
        console.error('Error fetching upcoming due dates:', err.message);
      }
    };

    fetchSummary();
    fetchRecentActivities();
    fetchUpcomingDue();
  }, []);

  const upcomingDeadlines = dueDates.map((item) => ({
    title: item.test_title,
    dueStatus: item.due_status,
    id: item.id // Make sure to include the id if available
  }));

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredActivities = recentActivities.filter((activity) =>
    activity.test_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Updated handleRowClick function to pass the test case ID to the navigation
  const handleRowClick = (testId) => {
    // Navigate to test case management with the test ID as a parameter
    navigate(`/qa_dashboard/testcase_management`, { 
      state: { selectedTestId: testId } 
    });
  };

  return (
    <div className="p-2">
      {/* Compact Search Bar */}
      <div className="mb-3">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Test Cases"
            className="w-full p-1 pl-8 text-sm bg-white rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-2 top-1.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          {/* Compact Test Case Summary Cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {loading ? (
              <p className="text-sm">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <>
                <div 
                  className="p-2 rounded shadow-sm"
                  style={{ 
                    backgroundColor: cardColors.total,
                    color: getTextColor(cardColors.total)
                  }}
                >
                  <h3 className="text-xs font-medium">Total TestCase</h3>
                  <p className="text-lg font-bold">{summary.total_test_cases}</p>
                </div>

                <div 
                  className="p-2 rounded shadow-sm"
                  style={{ 
                    backgroundColor: cardColors.completed,
                    color: getTextColor(cardColors.completed)
                  }}
                >
                  <h3 className="text-xs font-medium">Completed TestCase</h3>
                  <p className="text-lg font-bold">{summary.completed_test_cases}</p>
                </div>

                <div 
                  className="p-2 rounded shadow-sm"
                  style={{ 
                    backgroundColor: cardColors.pending,
                    color: getTextColor(cardColors.pending)
                  }}
                >
                  <h3 className="text-xs font-medium">Pending TestCase</h3>
                  <p className="text-lg font-bold">{summary.pending_test_cases}</p>
                </div>
              </>
            )}
          </div>

          {/* Compact Recent Test Cases */}
          <div className="bg-white p-3 rounded shadow-sm border border-gray-200 mb-3">
            <h2 className="text-sm font-medium mb-2">Recent Test Cases</h2>
            <div className="overflow-x-auto">
              {activityLoading ? (
                <p className="text-sm">Loading activities...</p>
              ) : activityError ? (
                <p className="text-red-500 text-sm">{activityError}</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Test
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity, index) => (
                        <tr 
                          key={index} 
                          onClick={() => handleRowClick(activity.id || activity.test_id)}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                            {activity.test_title}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            <span className={`px-1 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              activity.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : activity.status === "Assigned"
                                ? "bg-blue-100 text-blue-800"
                                : activity.status === "Commented"
                                ? "bg-yellow-100 text-yellow-800"
                                : activity.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                            {activity.created_at ? new Date(activity.created_at).toLocaleString().split(',')[0] : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-xs text-gray-500 py-2">
                          No matching test cases found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Compact Calendar Section */}
        <div className="w-full lg:w-64">
          <div className="bg-slate-200 p-2 rounded shadow-sm border border-gray-200 h-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium">Calendar</h2>
              <LucideCalendar size={16} className="text-blue-500" />
            </div>
            <div className="text-xs">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const day = date.getDate();
                  const month = date.getMonth();
                  const year = date.getFullYear();
                  
                  const isDue = dueDates.some(item => {
                    const dueDate = new Date(item.due_date);
                    return (
                      dueDate.getDate() === day &&
                      dueDate.getMonth() === month &&
                      dueDate.getFullYear() === year
                    );
                  });
                  
                  return isDue ? "bg-yellow-300 rounded-full text-black font-bold" : "";
                }}
                className="react-calendar--sm"
              />
            </div>
            {/* Compact Upcoming Deadlines */}
            <div className="mt-2">
              <h3 className="text-xs font-medium mb-1 text-gray-600">Upcoming Deadlines</h3>
              <div className="space-y-1">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                    <div 
                      key={index} 
                      className="p-1 bg-orange-50 border-l-2 border-orange-500 text-xs cursor-pointer hover:bg-orange-100"
                      onClick={() => handleRowClick(deadline.id)}
                    >
                      <div className="truncate text-xs">{deadline.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{deadline.dueStatus}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No upcoming deadlines.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QaMainSection;