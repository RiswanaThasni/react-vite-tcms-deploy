
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
    fetchUpcomingDue();
  }, []);

  // Function to get upcoming deadlines
  const upcomingDeadlines = dueDates.map((item) => ({
    title: item.test_case.test_title,
    dueStatus: item.test_case.due_status,
  }));

  return (
    <div className="p-3">
      <div className="relative w-64 mb-3">
        <input
          type="text"
          placeholder="Search TestCase"
          className="w-full p-1.5 pl-8 text-sm bg-white rounded"
        />
        <Search className="absolute left-2 top-2 text-gray-400" size={16} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {loading ? (
              <p className="text-xs">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-xs">{error}</p>
            ) : (
              <>
                <div className="bg-[#e4e4e4] p-3 rounded shadow-sm">
                  <h3 className="text-xs font-medium text-sidebar ">Total Test Case</h3>
                  <p className="text-xl font-bold text-sidebar">{summary.total_test_cases}</p>
                </div>

                <div className="bg-[#e4e4e4] p-3 rounded shadow-sm">
                  <h3 className="text-xs font-medium text-sidebar">Completed Test Case</h3>
                  <p className="text-xl font-bold text-sidebar">{summary.completed_test_cases}</p>
                </div>

                <div className="bg-[#e4e4e4] p-3 rounded shadow-sm">
                  <h3 className="text-xs font-medium text-sidebar">Pending Test Case</h3>
                  <p className="text-xl font-bold text-sidebar">{summary.pending_test_cases}</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-3 rounded shadow-sm border border-gray-200 mb-4">
            <h2 className="text-base font-medium mb-3">Recent Activities</h2>
            <div className="overflow-x-auto">
              {activityLoading ? (
                <p className="text-xs">Loading activities...</p>
              ) : activityError ? (
                <p className="text-red-500 text-xs">{activityError}</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Test
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                            {activity.test_case_title}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                            <span
                              className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                activity.status === "Completed"
                                  ? "bg-[#D8F278] text-[#201F31]"
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
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                            {activity.assigned_at}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center text-gray-500 py-2 text-xs"
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
        <div className="w-full lg:w-72">
          <div className="bg-slate-200 p-3 rounded shadow-sm border border-gray-200 h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium">Calendar</h2>
              <LucideCalendar size={18} className="text-[#201F31]" />
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
                  ? "bg-[#201F31] text-[#D8F278] rounded-full"
                  : "";
              }}
            />

            {/* Upcoming Deadlines */}
            <div className="mt-3">
              <h3 className="text-xs font-medium mb-2 text-gray-600">Upcoming Deadlines</h3>
              <div className="space-y-2">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="p-2 bg-mainsection bg-opacity-5  text-xs">
                      <div className="font-medium text-[#201F31]">{deadline.title}</div>
                      <div className="text-gray-500 mt-1 text-xs">{deadline.dueStatus}</div>
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

export default TestMainSection;