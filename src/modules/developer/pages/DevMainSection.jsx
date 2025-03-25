import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchTaskStatus, fetchRecentTasks, fetchUpcomingDeadlines } from '../../../api/viewDashBoardApi';
import { useNavigate } from "react-router-dom";

const DevMainSection = () => {
  const [taskCounts, setTaskCounts] = useState({ total_tasks: 0, completed_tasks: 0, pending_tasks: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [tasks, recent, deadlines] = await Promise.all([
        fetchTaskStatus(),
        fetchRecentTasks(),
        fetchUpcomingDeadlines(),
      ]);

      setTaskCounts(tasks);
      setRecentActivities(recent);
      setUpcomingDeadlines(deadlines);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6 flex items-center">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search project, Task"
            className="w-full p-2 pl-10 bg-gray-100 rounded-md"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="flex-1">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6 ">
              <Card className="" title="Total Task" count={taskCounts.total_tasks} bgColor="bg-card1" />
              <Card title="Completed Task" count={taskCounts.completed_tasks} bgColor="bg-card2" />
              <Card title="Pending Task" count={taskCounts.pending_tasks} bgColor="bg-card3" />
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6">
              <h2 className="text-lg font-medium mb-4">Recent activities</h2>
              <RecentActivitiesTable activities={recentActivities} />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="w-full lg:w-[350px]">
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Calendar</h2>
                <CalendarIcon size={20} className="text-blue-500" />
              </div>

              {/* React Calendar */}
              <Calendar
  onChange={setSelectedDate}
  value={selectedDate}
  className="w-full border rounded"
  minDate={new Date()} // Prevents selecting past dates
  tileClassName={({ date }) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    // Check if the date is a due date
    const isDueDate = upcomingDeadlines.some((deadline) => {
      const dueDate = new Date(deadline.due_date).setHours(0, 0, 0, 0);
      return dueDate === date.setHours(0, 0, 0, 0);
    });

    // Apply red color only to due dates (ignore Saturdays & Sundays)
    if (isDueDate) {
      return "text-red-600 font-bold";
    }

    return ""; // Normal color for all other dates, including weekends
  }}
/>






              {/* Upcoming Deadlines */}
              <h3 className="text-sm font-medium mb-2 text-gray-600 mt-4">Upcoming Deadlines</h3>
              <div className="space-y-2">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((deadline) => (
                    <DeadlineCard key={deadline.id} task={deadline} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming deadlines.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// **Reusable Components**

// Summary Cards
const Card = ({ title, count, bgColor }) => (
  <div className={`${bgColor} p-4 rounded shadow-sm`}>
    <h3 className="text-sm font-medium text-white">{title}</h3>
    <p className="text-2xl font-bold text-white">{count}</p>
  </div>
);

// Recent Activities Table
const RecentActivitiesTable = ({ activities }) => {
  const navigate = useNavigate();

  const handleRowClick = (taskId) => {
    navigate(`/dev_dashboard/tasks/${taskId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated At</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr
              key={activity.id}
              onClick={() => handleRowClick(activity.id)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{activity.task_name}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(activity.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// Deadline Cards
const DeadlineCard = ({ task }) => (
  <div className="p-2 bg-red-50 border-l-2 border-red-500 text-xs">
    {task.task_name}
    <div className="text-gray-500 mt-1">{task.due_status}</div>
  </div>
);

// Helper Functions
const getStatusColor = (status) => {
  return status === "completed" ? "bg-green-100 text-green-800" :
         status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
         "bg-blue-100 text-blue-800";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default DevMainSection;
