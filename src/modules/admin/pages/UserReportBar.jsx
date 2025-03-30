import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { User } from "lucide-react";
import { UsersTypeCount } from "../../../api/userApi";

const UserReportBar = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const data = await UsersTypeCount();
        
        if (data) {
          // Handle total_users safely
          if (data.total_users !== undefined) {
            setTotalUsers(
              typeof data.total_users === 'number' 
                ? data.total_users 
                : (Array.isArray(data.total_users) ? data.total_users.length : 0)
            );
          }
          
          // Handle active_users safely
          if (data.active_users !== undefined) {
            setActiveUsers(
              typeof data.active_users === 'number' 
                ? data.active_users 
                : (Array.isArray(data.active_users) ? data.active_users.length : 0)
            );
          }
          
          // Handle inactive_users safely
          if (data.inactive_users !== undefined) {
            setInactiveUsers(
              typeof data.inactive_users === 'number' 
                ? data.inactive_users 
                : (Array.isArray(data.inactive_users) ? data.inactive_users.length : 0)
            );
          }
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

  const data = [
    { name: "active", value: activeUsers, color: "#F3F4F6" },
    { name: "inactive", value: inactiveUsers, color: "#F3F4F6" },
  ];

  if (loading) return <p className="text-center">Loading user data...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="top-0  rounded-lg ">
     <div className="relative flex justify-center items-center ">
        <PieChart width={250} height={150}>

        <Pie
            data={[{ name: "Outer", value: 1 }]} 
            cx={125}
            cy={120} // Move slightly up
            startAngle={180}
            endAngle={0}
            innerRadius={100}
            outerRadius={110} 
            fill="#D8F278"
            stroke="none"
            cornerRadius={8}
              paddingAngle={8} // Increased padding for more space between slices


          />

          {/* Middle Layer (Extra Inner Layer for Styling) */}
          <Pie
            data={[{ name: "Inner Border", value: 1 }]}
            cx={125}
            cy={120} // Move slightly up
            startAngle={180}
            endAngle={0}
            innerRadius={95}
            outerRadius={98}
            fill="#D8F278"
            stroke="none"
            cornerRadius={8}

          />

        
<Pie
  data={data}
  cx={125}
  cy={120}
  startAngle={180} // Start from the left side
  endAngle={0} // Ends at the right side
  innerRadius={75}
  outerRadius={90}
  paddingAngle={0}
  dataKey="value"
  cornerRadius={5}
>
  {data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
</Pie>

        </PieChart>
        {/* User Icon at Center of Half Circle */}
         <div className="absolute top-18 left-130 flex flex-col items-center">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User size={24} className="text-black" />
                  </div>
                  <p className="text-xl font-bold text-gray-800">{totalUsers}</p>
                  <p className="text-sm font-semibold text-blue-950">Total Users</p>
                </div>
              </div>
              {/* Active & Inactive Sections */}
              <div className="flex gap-30  ">
                <div className="flex flex-col items-center p-1 ml-112  rounded-lg ">
                  <p className="text-sm font-semibold text-green-900">{activeUsers}</p>
                  <p className="text-sm font-semibold text-green-600">Active</p>
                </div>
                <div className="flex flex-col items-center p-1 rounded-lg ">
                  <p className="text-sm font-bold text-red-900">{inactiveUsers}</p>
                  <p className="text-sm font-semibold text-red-600">Inactive</p>
                </div>
              </div>
            </div>
  );
};

export default UserReportBar;