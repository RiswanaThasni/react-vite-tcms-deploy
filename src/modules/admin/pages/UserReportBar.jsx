import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { User, UserCheck, UserX, Activity } from "lucide-react";
import { UsersTypeCount } from "../../../api/userApi";


const UserReportBar = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const data = await UsersTypeCount();
        
        if (data) {
          // Filter out admin users if the data includes user details
          let filteredTotal = data.total_users || 0;
          let filteredActive = data.active_count || 0;
          let filteredInactive = data.inactive_count || 0;
          
          // If we have the detailed users array, we can filter out admins
          if (Array.isArray(data.users)) {
            const nonAdminUsers = data.users.filter(user => user.role !== "Admin");
            filteredTotal = nonAdminUsers.length;
            
            if (Array.isArray(data.active_users)) {
              const nonAdminActiveUsers = data.active_users.filter(user => user.role !== "Admin");
              filteredActive = nonAdminActiveUsers.length;
              filteredInactive = filteredTotal - filteredActive;
            }
          }
          
          setUserStats({
            totalUsers: filteredTotal,
            activeUsers: filteredActive,
            inactiveUsers: filteredInactive
          });
        } else {
          throw new Error("No data received from API");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, []);

  // Calculate active percentage for the progress indicator
  const activePercentage = userStats.totalUsers > 0 
    ? Math.round((userStats.activeUsers / userStats.totalUsers) * 100) 
    : 0;

  // Chart data
  const chartData = [
    { name: "Total", value: userStats.totalUsers, color: "#3B82F6" },
    { name: "Active", value: userStats.activeUsers, color: "#10B981" },
    { name: "Inactive", value: userStats.inactiveUsers, color: "#EF4444" }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="ml-2 text-gray-600">Loading user data...</span>
    </div>
  );

  if (error) return (
    <div className="text-center p-2 bg-red-50 rounded-lg">
      <p className="text-red-500 font-medium">Error: {error}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className="bg-blue-100 p-2 rounded-lg flex items-center">
          <div className="bg-blue-200 p-3 rounded-full">
            <User size={24} className="text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-700">{userStats.totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg flex items-center">
          <div className="bg-green-200 p-3 rounded-full">
            <UserCheck size={24} className="text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-700">{userStats.activeUsers}</p>
          </div>
        </div>
        
        <div className="bg-red-100 p-4 rounded-lg flex items-center">
          <div className="bg-red-200 p-3 rounded-full">
            <UserX size={24} className="text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Inactive Users</p>
            <p className="text-2xl font-bold text-red-700">{userStats.inactiveUsers}</p>
          </div>
        </div>
      </div>

      

      
    </div>
  );
};

export default UserReportBar;