import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../redux/slices/userSlice";
import AddUserPopup from "../../../components/ui/AddUserPopup";
import { FiMoreVertical } from "react-icons/fi";
import { fetchRole } from "../../../api/userApi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";




const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all")
  const navigate = useNavigate()

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

  const handleEditUser = (userId) => {
    dispatch(updateUserStatus({ id: userId, status: "active" }));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to inactive this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
  
    const userRoleId = user.role?.id?.toString() || user.role?.toString();
    const matchesRole =
      selectedRole === "all" || userRoleId === selectedRole.toString();
  
    const matchesStatus =
      selectedStatus === "all" || user.status?.toLowerCase() === selectedStatus;
  
    return matchesSearch && matchesRole && matchesStatus;
  })

  const handleRowClick = (userId)=>{
    navigate(`/admin_dashboard/view_user_details/${userId}`)
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full p-1.5 pl-7 text-xs bg-gray-100 rounded-md border border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2 text-gray-400" size={14} />
          </div>

         
        </div>

        <div className="flex flex-row gap-1.5">
        <select
            className="bg-gray-100 text-xs rounded-md border border-gray-200 p-1.5"
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
            className="bg-gray-100 text-xs rounded-md border border-gray-200 p-1.5"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
          <div className="relative">
          <button
    className="flex items-center bg-yellow-400 text-black rounded-md px-2 py-1"
    onClick={() => setShowPopup(true)}
  >
    <span className="mr-1 text-sm font-bold">+</span>
    <span className="text-xs">Add User</span>
  </button>

 
</div>

        </div>
       

        
      </div>

      <div className="bg-gray-100 rounded-lg overflow-hidden">
        {loading && <p className="text-center text-xs p-2">Loading users...</p>}
        {error && <p className="text-red-500 text-center text-xs p-2">{error}</p>}

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-200">
              <th className="text-left p-2"></th>
              <th className="text-left p-2">Employee ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50" onClick={()=>handleRowClick(user.id)}>
              <td className="p-2">
  <img
    src={user?.profile_picture || "/default.svg"}
    alt="Profile"
    className="w-7 h-7 rounded-full object-cover"
  />
</td>
                <td className="p-2">{user?.user_id || "N/A"}</td>
                <td className="p-2">{user?.name || "N/A"}</td>
                <td className="p-2">{user?.email || "N/A"}</td>
                <td className="p-2">{user?.role || "N/A"}</td>
                <td
                  className={`p-2 font-bold ${
                    user.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user?.status || "Inactive"}
                </td>
                <td className="p-2 relative">
                  <button onClick={() => toggleMenu(user.id)} className="p-1">
                    <FiMoreVertical size={14} />
                  </button>
                  {menuOpen === user.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white shadow-md rounded-md z-10 text-xs border">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="block w-full text-left px-2 py-1.5 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="block w-full text-left px-2 py-1.5 text-red-600 hover:bg-gray-100"
                      >
                        Inactive User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 text-xs py-2">
            No users found
          </div>
        )}
      </div>

      {showPopup && <AddUserPopup onClose={() => setShowPopup(false)} />}

    </div>
  );
};

export default UserManagement;