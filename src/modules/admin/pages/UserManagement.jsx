

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers, deleteUser } from "../../../redux/slices/userSlice";
// import AddUserPopup from "../../../components/ui/AddUserPopup";
// import { Search, UserPlus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { fetchRole } from "../../../api/userApi";
// import { API_URL } from "../../../utils/constants";

// const UserManagement = () => {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.user);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(null);
//   const [role, setRole] = useState([]);
//   const [selectedRole, setSelectedRole] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(fetchUsers());
//     const getRoles = async () => {
//       try {
//         const data = await fetchRole();
//         setRole(data);
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//       }
//     };
//     getRoles();
//   }, [dispatch]);

//   const toggleMenu = (userId) => {
//     setMenuOpen(menuOpen === userId ? null : userId);
//   };

  

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchQuery.toLowerCase());

//     const userRoleId = user.role?.id?.toString() || user.role?.toString();
//     const matchesRole =
//       selectedRole === "all" || userRoleId === selectedRole.toString();

//     const matchesStatus =
//       selectedStatus === "all" || user.status?.toLowerCase() === selectedStatus;

//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const handleRowClick = (userId) => {
//     navigate(`/admin_dashboard/view_user_details/${userId}`);
//   };

//   return (
//     <div className="p-4 bg-slate-100 rounded-lg h-full">
//       <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-4">
        
//         <div className="relative flex-grow max-w-md">
//           <input
//             type="text"
//             placeholder="Search by name or email"
//             className="w-full p-2 pl-8 text-xs bg-white rounded-lg border border-gray-200"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <Search className="absolute left-2 top-2 text-gray-400" size={14} />
//         </div>

//         <div className="flex flex-row gap-2 self-end md:self-auto">
//           <select
//             className="bg-white text-xs rounded-lg border border-gray-200 p-2"
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//           >
//             <option value="all">All Roles</option>
//             {role.map((roles, index) => (
//               <option key={index} value={roles.id.toString()} className="text-xs">
//                 {roles.role_name}
//               </option>
//             ))}
//           </select>

//           <select
//             className="bg-white text-xs rounded-lg border border-gray-200 p-2"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="all">All Users</option>
//             <option value="active">Active Users</option>
//             <option value="inactive">Inactive Users</option>
//           </select>
          
//           <button 
//             className="flex items-center bg-[#D8F278] text-black rounded-lg px-4 py-2 hover:bg-[#c2df5a] transition-colors"
//             onClick={() => setShowPopup(true)}
//           >
//             <UserPlus size={16} strokeWidth={2} className="mr-1" />
//             <span className="text-xs"></span>
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg overflow-hidden shadow-sm">
//         {loading && <p className="text-center text-xs p-4">Loading users...</p>}
//         {error && <p className="text-red-500 text-center text-xs p-4">{error}</p>}

//         <table className="w-full text-xs">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               <th className="text-left p-3 text-gray-500 font-medium"></th>
//               <th className="text-left p-3 text-gray-500 font-medium">Employee ID</th>
//               <th className="text-left p-3 text-gray-500 font-medium">Name</th>
//               <th className="text-left p-3 text-gray-500 font-medium">Email</th>
//               <th className="text-left p-3 text-gray-500 font-medium">Role</th>
//               <th className="text-left p-3 text-gray-500 font-medium">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr 
//                 key={user.id} 
//                 className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors" 
//                 onClick={() => handleRowClick(user.id)}
//               >
//                 <td className="p-3">
//                   <img
//                     src={user?.profile_picture ? `${API_URL}${user.profile_picture}` : "/default.svg"}
//                     alt="Profile"
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                 </td>
//                 <td className="p-3">{user?.user_id || "N/A"}</td>
//                 <td className="p-3 font-medium">{user?.name || "N/A"}</td>
//                 <td className="p-3">{user?.email || "N/A"}</td>
//                 <td className="p-3">{user?.role || "N/A"}</td>
//                 <td className="p-3">
//                   <span 
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       user.status === "active" 
//                         ? "bg-green-100 text-green-600" 
//                         : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {user?.status || "Inactive"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredUsers.length === 0 && (
//           <div className="text-center text-gray-500 py-6">
//             <Search size={24} className="mx-auto mb-2 text-gray-400" />
//             <p className="text-sm">No users found</p>
//             {searchQuery && <p className="text-xs mt-1 text-gray-400">Try adjusting your search or filters</p>}
//           </div>
//         )}
//       </div>

//       {showPopup && <AddUserPopup onClose={() => setShowPopup(false)} />}
//     </div>
//   );
// };

// export default UserManagement;



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../redux/slices/userSlice";
import AddUserPopup from "../../../components/ui/AddUserPopup";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchRole } from "../../../api/userApi";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
    const getRoles = async () => {
      try {
        const data = await fetchRole();
        setRole(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getRoles();
  }, [dispatch]);

  const toggleMenu = (userId) => {
    setMenuOpen(menuOpen === userId ? null : userId);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const userRoleId = user.role?.id?.toString() || user.role?.toString();
    const matchesRole =
      selectedRole === "all" || userRoleId === selectedRole.toString();

    const matchesStatus =
      selectedStatus === "all" || user.status?.toLowerCase() === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRowClick = (userId) => {
    navigate(`/admin_dashboard/view_user_details/${userId}`);
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg h-full">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-4">
        
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full p-2 pl-8 text-xs bg-white rounded-lg border border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-2 text-gray-400" size={14} />
        </div>

        <div className="flex flex-row gap-2 self-end md:self-auto">
          <select
            className="bg-white text-xs rounded-lg border border-gray-200 p-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {role.map((roles, index) => (
              <option key={index} value={roles.id.toString()} className="text-xs">
                {roles.role_name}
              </option>
            ))}
          </select>

          <select
            className="bg-white text-xs rounded-lg border border-gray-200 p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
          
          <button 
            className="flex items-center bg-[#D8F278] text-black rounded-lg px-4 py-2 hover:bg-[#c2df5a] transition-colors"
            onClick={() => setShowPopup(true)}
          >
            <UserPlus size={16} strokeWidth={2} className="mr-1" />
            <span className="text-xs">Add User</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {loading && <p className="text-center text-xs p-4">Loading users...</p>}
        {error && <p className="text-red-500 text-center text-xs p-4">{error}</p>}

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 text-gray-500 font-medium"></th>
              <th className="text-left p-3 text-gray-500 font-medium">Employee ID</th>
              <th className="text-left p-3 text-gray-500 font-medium">Name</th>
              <th className="text-left p-3 text-gray-500 font-medium">Email</th>
              <th className="text-left p-3 text-gray-500 font-medium">Role</th>
              <th className="text-left p-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr 
                key={user.id} 
                className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors" 
                onClick={() => handleRowClick(user.id)}
              >
                <td className="p-3">
                  <img
                    src={user?.profile_picture || "/default.svg"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </td>
                <td className="p-3">{user?.user_id || "N/A"}</td>
                <td className="p-3 font-medium">{user?.name || "N/A"}</td>
                <td className="p-3">{user?.email || "N/A"}</td>
                <td className="p-3">{user?.role || "N/A"}</td>
                <td className="p-3">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user?.status || "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            <Search size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No users found</p>
            {searchQuery && <p className="text-xs mt-1 text-gray-400">Try adjusting your search or filters</p>}
          </div>
        )}
      </div>

      {showPopup && <AddUserPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default UserManagement;