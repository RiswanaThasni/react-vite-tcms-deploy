import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchTaskStatus, fetchRecentTasks, fetchUpcomingDeadlines } from '../../../api/viewDashBoardApi';
import { useNavigate } from "react-router-dom";
import randomColor from 'randomcolor'; // Import randomColor library

const DevMainSection = () => {
  const [taskCounts, setTaskCounts] = useState({ total_tasks: 0, completed_tasks: 0, pending_tasks: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardColors, setCardColors] = useState({
    card1: '#D8F278', // Default color that matches your existing scheme
    card2: '#b8e868', // Slightly different shade
    card3: '#c8f088', // Another complementary shade
  });

 // Function to generate a well-matched color palette with diverse colors
const generateColorPalette = () => {
  // Generate three distinct colors with different hues
  const baseColor = randomColor({
    luminosity: 'light',
    hue: 'random',  // Changed from 'green' to 'random'
    format: 'hex'
  });
  
  const secondColor = randomColor({
    luminosity: 'light',
    hue: 'random',  // Changed from 'green' to 'random'
    format: 'hex'
  });
  
  const thirdColor = randomColor({
    luminosity: 'light',
    hue: 'random',  // Changed from 'yellow' to 'random'
    format: 'hex'
  });
  
  return {
    card1: baseColor,
    card2: secondColor,
    card3: thirdColor
  };
};

  // Function to get darker shade for text or borders
  const getDarkerShade = (color) => {
    color = color.replace('#', '');
    
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    r = Math.floor(r * 0.8);
    g = Math.floor(g * 0.8);
    b = Math.floor(b * 0.8);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Function to determine text color based on background
  const getTextColor = (bgColor) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.7 ? '#201F31' : '#ffffff'; // Use your dark color (#201F31) for contrast
  };

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
      
      // Generate a new color palette for this session
      setCardColors(generateColorPalette());
      
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-2">
      {/* Search Bar - Reduced padding */}
      <div className="mb-4 flex items-center">
        <div className="relative w-64">
          <input
            type="text" 
            placeholder="Search project, Task"
            className="w-full p-1.5 pl-8 bg-white rounded-lg text-sm"
          />
          <Search className="absolute left-2 top-2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side */}
          <div className="flex-1">
            {/* Summary Cards - Reduced gap */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card 
                title="Total Task" 
                count={taskCounts.total_tasks} 
                bgColor={cardColors.card1} 
                textColor={getTextColor(cardColors.card1)}
              />
              <Card 
                title="Completed Task" 
                count={taskCounts.completed_tasks} 
                bgColor={cardColors.card2} 
                textColor={getTextColor(cardColors.card2)}
              />
              <Card 
                title="Pending Task" 
                count={taskCounts.pending_tasks} 
                bgColor={cardColors.card3} 
                textColor={getTextColor(cardColors.card3)}
              />
            </div>

            {/* Recent Activities - Reduced padding */}
            <div className="bg-white p-3 rounded-lg mb-4">
              <h2 className="text-base font-medium mb-2">Recent activities</h2>
              <RecentActivitiesTable 
                activities={recentActivities} 
                generateActivityColor={() => randomColor({
                  luminosity: 'light',
                  hue: 'random'
                })}
              />
            </div>
          </div>

          {/* Calendar Section - Reduced width */}
          <div className="w-full lg:w-64">
            <div className="bg-slate-200 p-3 rounded-lg  h-full">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-medium">Calendar</h2>
                <CalendarIcon size={16} className="text-blue-500" />
              </div>

              {/* React Calendar - Custom styles will be applied via CSS */}
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full border rounded  text-xs"
                minDate={new Date()} 
                tileClassName={({ date }) => {
                  const isDueDate = upcomingDeadlines.some((deadline) => {
                    const dueDate = new Date(deadline.due_date).setHours(0, 0, 0, 0);
                    return dueDate === date.setHours(0, 0, 0, 0);
                  });
                  
                  return isDueDate ? "text-red-600 font-bold" : "";
                }}
              />

              {/* Upcoming Deadlines */}
              <h3 className="text-xs font-medium mb-1 text-gray-600 mt-3">Upcoming Deadlines</h3>
              <div className="space-y-1">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((deadline, index) => {
                    // Generate a unique pastel color for each deadline
                    const deadlineColor = randomColor({
                      luminosity: 'light',
                      hue: 'red', // Red family for deadlines
                      format: 'hex'
                    });
                    
                    return (
                      <DeadlineCard 
                        key={deadline.id} 
                        task={deadline} 
                        bgColor={deadlineColor}
                        textColor={getTextColor(deadlineColor)}
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-xs">No upcoming deadlines.</p>
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

// Summary Cards - Now with dynamic styling
const Card = ({ title, count, bgColor, textColor }) => (
  <div 
    className="p-2 rounded shadow-sm transition-all duration-200 hover:shadow-md"
    style={{ 
      backgroundColor: bgColor
      // Remove this line: borderLeft: `4px solid ${getDarkerShade(bgColor)}`
    }}
  >
    <h3 className="text-xs font-medium" style={{ color: textColor }}>{title}</h3>
    <p className="text-xl font-bold" style={{ color: textColor }}>{count}</p>
  </div>
);

// Helper function to get darker shade - defined globally
const getDarkerShade = (color) => {
  color = color.replace('#', '');
  
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  
  r = Math.floor(r * 0.8);
  g = Math.floor(g * 0.8);
  b = Math.floor(b * 0.8);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Recent Activities Table - Enhanced with random colors
const RecentActivitiesTable = ({ activities, generateActivityColor }) => {
  const navigate = useNavigate();
  const [rowColors, setRowColors] = useState({});

  useEffect(() => {
    // Generate colors for each activity
    const colors = {};
    activities.forEach(activity => {
      colors[activity.id] = generateActivityColor();
    });
    setRowColors(colors);
  }, [activities, generateActivityColor]);

  const handleRowClick = (taskId) => {
    navigate(`/dev_dashboard/tasks/${taskId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Task</th>
            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Status</th>
            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Updated</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr
              key={activity.id}
              onClick={() => handleRowClick(activity.id)}
              className="hover:bg-gray-100 cursor-pointer transition-colors"
              // style={{ 
              //   borderLeft: `2px solid ${rowColors[activity.id] || '#f0f0f0'}` 
              // }}
            >
              <td className="px-2 py-1.5 font-medium text-gray-900">{activity.task_name}</td>
              <td className="px-2 py-1.5">
                <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-2 py-1.5 text-gray-500">{formatDate(activity.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Deadline Cards - Now with dynamic styling
const DeadlineCard = ({ task, bgColor, textColor }) => (
  <div 
    className="p-1.5 rounded text-xs" 
    style={{ 
      backgroundColor: bgColor || '#fee2e2',
      // borderLeft: `2px solid ${getDarkerShade(bgColor || '#fee2e2')}` 
    }}
  >
    <div className="font-medium" style={{ color: textColor || '#7f1d1d' }}>{task.task_name}</div>
    <div style={{ color: textColor ? getDarkerShade(textColor) : '#ef4444' }} className="text-xs mt-0.5">
      {task.due_status}
    </div>
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