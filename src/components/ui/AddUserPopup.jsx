import React, { useEffect, useState } from "react";
import { fetchRole, addUser, addRole } from "../../api/userApi";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";

const AddUserPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [developerRoleId, setDeveloperRoleId] = useState(null);
  const [newRole, setNewRole] = useState(""); // Store new role input
  const [formData, setFormData] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    specialization: [],
  });

  useEffect(() => {
    const getRoles = async () => {
      try {
        const data = await fetchRole();
        setRoles(data);
        const developerRole = data.find(role => role.role_name.toLowerCase() === "developer");
        if (developerRole) setDeveloperRoleId(developerRole.id.toString());
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecializationChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      specialization: checked
        ? [...prevData.specialization, value]
        : prevData.specialization.filter((item) => item !== value),
    }));
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value, specialization: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      alert("Please select a role!");
      return;
    }
    try {
      const userData = { ...formData, specialization: formData.specialization.join(", ") };
      await addUser(userData);
      alert("User added successfully!");
      
      // Fetch updated users list after adding a new user
      dispatch(fetchUsers());
      
      onClose();
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error);
      alert("Failed to add user.");
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      alert("Role name cannot be empty!");
      return;
    }
    try {
      await addRole(newRole); // Add role to backend
      setNewRole(""); // Clear input field
  
      // Fetch updated roles list after adding
      const updatedRoles = await fetchRole();
      setRoles(updatedRoles);
  
      alert("Role added successfully!");
    } catch (error) {
      console.error("Error adding role:", error.response?.data || error);
      alert(error.response?.data?.role_name?.[0] || "Failed to add role.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg">
          
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="user_id" placeholder="User ID" className="border p-2 w-full mb-3 rounded" value={formData.user_id} onChange={handleChange} required />
          <input type="text" name="first_name" placeholder="First Name" className="border p-2 w-full mb-3 rounded" value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Last Name" className="border p-2 w-full mb-3 rounded" value={formData.last_name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="border p-2 w-full mb-3 rounded" value={formData.email} onChange={handleChange} required />

          <select className="border p-2 w-full mb-3 rounded" name="role" value={formData.role} onChange={handleRoleChange} required>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.role_name}</option>
            ))}
          </select>

          {formData.role === developerRoleId && (
            <div className="mb-3">
              <label className="block font-medium text-gray-700">Specialization:</label>
              <div className="flex flex-col">
                {['react', 'python', 'flutter'].map((spec) => (
                  <label key={spec}>
                    <input type="checkbox" value={spec} checked={formData.specialization.includes(spec)} onChange={handleSpecializationChange} className="mr-2" />
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <input type="text" placeholder="New Role" className="border p-2 w-full mb-2 rounded" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
            <button type="button" onClick={handleAddRole} className="bg-green-500 text-white px-4 py-2 rounded-md w-full">
              Add Role
            </button>
          </div>

          <div className="flex justify-between mt-4">
            <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;