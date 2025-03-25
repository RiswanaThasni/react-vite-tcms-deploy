import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../redux/slices/userSlice";
import AddUserPopup from "../../../components/ui/AddUserPopup";
import { FiMoreVertical } from "react-icons/fi";
import { fetchRole } from "../../../api/userApi";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users from Redux store
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched Users:", users); // Debugging API response
  }, [users]); 

  useEffect(() => {
    // Fetch roles from API
    const getRoles = async () => {
      try {
        const data = await fetchRole(); // API Call
        setRole(data); // Ensure this matches your API response structure
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getRoles();
  }, []);

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
  });
  
  
  
  
  

  return (
    <div className="p-4 w-full">
      <div className="justify-between flex items-center mb-4">
        <div className="flex items-center gap-5">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border-null w-md bg-gray-200 rounded-lg p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="bg-gray-200 w-40 rounded-lg border-null p-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>

            {/* Map API roles */}
            {role.map((roles, index) => (
              <option key={index} value={roles.id.toString()}>
                {roles.role_name}
              </option>
            ))}
          </select>
          <select
            className="bg-gray-200 w-40 rounded-lg border-null p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
        </div>

        <button
          className="flex items-center bg-yellow-400 text-black rounded-md px-3 py-2"
          onClick={() => setShowPopup(true)}
        >
          <span className="mr-2 font-bold text-lg">+</span>
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-gray-100 rounded-lg overflow-hidden">
        {loading && <p className="text-center p-4">Loading users...</p>}
        {error && <p className="text-red-500 text-center p-4">{error}</p>}

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-6 font-medium"></th>
              <th className="text-left py-3 px-6 font-medium">Employee ID</th>
              <th className="text-left py-3 px-6 font-medium">Name</th>
              <th className="text-left py-3 px-6 font-medium">Email</th>
              <th className="text-left py-3 px-6 font-medium">Role</th>
              <th className="text-left py-3 px-6 font-medium">Status</th>
              <th className="text-left py-3 px-6 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">N/A</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">{user?.user_id || "N/A"}</td>


                <td className="py-4 px-6">{user?.name || "N/A"}</td>
                <td className="py-4 px-6">{user?.email || "N/A"}</td>
                <td className="py-4 px-6">{user?.role || "N/A"}</td>
                <td
                  className={`py-4 px-6 font-bold ${
                    user.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user?.status || "Inactive"}
                </td>
                <td className="py-4 px-6 relative">
                  <button onClick={() => toggleMenu(user.id)} className="p-2">
                    <FiMoreVertical size={20} />
                  </button>
                  {menuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
      </div>

      {showPopup && <AddUserPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default UserManagement;
