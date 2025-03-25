import React, { useEffect, useState } from 'react';
import { Calendar as LucideCalendar, Search } from 'lucide-react';
import { recentActivity, summaryCard, upComingDue } from '../../../api/testApi';
import Calendar from "react-calendar"; 




const TestMainSection = () => {
 
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);
  const [dueDates, setDueDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());



  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await summaryCard();
        setSummary({
          total_test_cases: data.total_test_cases || 0,
          completed_test_cases: data.completed_test_cases || 0,
          pending_test_cases: data.pending_test_cases || 0,
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
        const data = await recentActivity();
        setRecentActivities(data || []);
        setActivityLoading(false);
      } catch (err) {
        setActivityError(err.message);
        setActivityLoading(false);
      }
    };
    const fetchUpcomingDue = async () => {
      try {
        const data = await upComingDue();
        setDueDates(data || []);
      } catch (err) {
        console.error('Error fetching upcoming due dates:', err.message);
      }
    };

    fetchSummary();
    fetchRecentActivities();
    fetchUpcomingDue()
  }, []);


  const isDueDate = (day) => {
    return dueDates.some((item) => {
      const dueDay = new Date(item.test_case.due_date).getDate();
      return dueDay === day;
    });
  };
  
  // Function to get upcoming deadlines
  const upcomingDeadlines = dueDates.map((item) => ({
    title: item.test_case.test_title,
    dueStatus: item.test_case.due_status,
  }));
  
  
    

  

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6 flex items-center">
        <div className="relative w-80 items-center mb-4">
          <input
            type="text"
            placeholder="Search TestCase"
            className="w-full p-2 pl-10  bg-gray-100 rounded-md"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
  {/* Show loading spinner or data */}
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <>
      <div className="bg-card4 p-4 rounded shadow-sm">
        <h3 className="text-sm font-medium text-white">Total</h3>
        <p className="text-2xl font-bold text-white">{summary.total_test_cases}</p>
      </div>

      <div className="bg-card2 p-4 rounded shadow-sm">
        <h3 className="text-sm font-medium text-white">Completed</h3>
        <p className="text-2xl font-bold text-white">{summary.completed_test_cases}</p>
      </div>

      <div className="bg-card3 p-4 rounded shadow-sm">
        <h3 className="text-sm font-medium text-white">Pending</h3>
        <p className="text-2xl font-bold text-white">{summary.pending_test_cases}</p>
      </div>
    </>
  )}
</div>


<div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
            <div className="overflow-x-auto">
              {activityLoading ? (
                <p>Loading activities...</p>
              ) : activityError ? (
                <p className="text-red-500">{activityError}</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Test
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {activity.test_case_title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                activity.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : activity.status === "Assigned"
                                  ? "bg-blue-100 text-blue-800"
                                  : activity.status === "Commented"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {activity.assigned_at}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center text-gray-500 py-3"
                        >
                          No recent activities found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>


        {/* Calendar Section */}
        <div className="w-full lg:w-80">
    <div className="bg-white p-4 rounded shadow-sm border border-gray-200 h-full">
    <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Calendar</h2>
          <LucideCalendar size={20} className="text-blue-500" /> {/* Lucide Icon */}
        </div>
        <Calendar
  onChange={setSelectedDate}
  value={selectedDate}
  tileClassName={({ date }) => {
    return dueDates.some((item) => {
      const dueDate = new Date(item.test_case.due_date).setHours(0, 0, 0, 0);
      const currentDate = new Date(date).setHours(0, 0, 0, 0);
      return dueDate === currentDate;
    })
      ? "bg-red-500 text-yellow-300 rounded-full"
      : "";
  }}
/>


      {/* Upcoming Deadlines */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">Upcoming Deadlines</h3>
        <div className="space-y-2">
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-2 bg-orange-50 border-l-2 border-orange-500 text-xs">
                {deadline.title}
                <div className="text-gray-500 mt-1">{deadline.dueStatus}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No upcoming deadlines.</p>
          )}
        </div>
      </div>
    </div>
  </div>
      </div>
    </div>
  );
};

export default TestMainSection;