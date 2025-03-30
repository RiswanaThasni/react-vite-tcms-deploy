import React, { useEffect, useState, useRef } from "react";
import { fetchRole, addUser, addRole } from "../../api/userApi";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import { X, PlusCircle, User, Mail, UserPlus, Tag, Code } from "lucide-react";

const AddUserPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [developerRoleId, setDeveloperRoleId] = useState(null);
  const [newRole, setNewRole] = useState(""); 
  const [showAddRole, setShowAddRole] = useState(false);
  const roleInputRef = useRef(null);
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
    if (e.target.value === "add-new-role") {
      setShowAddRole(true);
      setTimeout(() => {
        if (roleInputRef.current) {
          roleInputRef.current.focus();
        }
      }, 0);
    } else {
      setFormData({ ...formData, role: e.target.value, specialization: [] });
      setShowAddRole(false);
    }
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
      setShowAddRole(false);
  
      alert("Role added successfully!");
    } catch (error) {
      console.error("Error adding role:", error.response?.data || error);
      alert(error.response?.data?.role_name?.[0] || "Failed to add role.");
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".role-input-container")) {
      return;
    }
    setShowAddRole(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get the specialized class based on the type
  const getSpecIcon = (type) => {
    switch(type) {
      case 'react':
        return <Code size={16} className="text-blue-500" />;
      case 'python':
        return <Code size={16} className="text-yellow-600" />;
      case 'flutter':
        return <Code size={16} className="text-blue-400" />;
      default:
        return <Code size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 flex p-6 justify-end bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-slate-200 w-96 shadow-lg relative rounded-lg max-h-min overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <UserPlus className="text-custom-sidebar mr-2" size={20} strokeWidth={2} />
              <h2 className="text-xl font-semibold text-custom-sidebar">Add New User</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 bg-white rounded-full p-1">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-500" size={16} />
                </div>
                <input 
                  type="text" 
                  name="user_id" 
                  placeholder="User ID" 
                  className="bg-white border border-gray-300 p-2 pl-10 w-full rounded-lg" 
                  value={formData.user_id} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-500" size={16} />
                  </div>
                  <input 
                    type="text" 
                    name="first_name" 
                    placeholder="First Name" 
                    className="bg-white border border-gray-300 p-2 pl-10 w-full rounded-lg" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-500" size={16} />
                  </div>
                  <input 
                    type="text" 
                    name="last_name" 
                    placeholder="Last Name" 
                    className="bg-white border border-gray-300 p-2 pl-10 w-full rounded-lg" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-500" size={16} />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  className="bg-white border border-gray-300 p-2 pl-10 w-full rounded-lg" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="text-gray-500" size={16} />
                </div>
                <select 
                  className="bg-white border border-gray-300 p-2 pl-10 w-full rounded-lg appearance-none" 
                  name="role" 
                  value={formData.role || (showAddRole ? "add-new-role" : "")} 
                  onChange={handleRoleChange} 
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.role_name}</option>
                  ))}
                  <option value="add-new-role">+ Add New Role</option>
                </select>
                
                {showAddRole && (
                  <div className="absolute mt-1 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2 role-input-container">
                    <div className="flex items-center space-x-2">
                      <input
                        ref={roleInputRef}
                        type="text"
                        placeholder="New Role Name"
                        className="border border-gray-300 p-2 flex-grow rounded-lg"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="bg-sidebar text-white p-2 rounded-lg hover:bg-sidebar-hover"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {formData.role === developerRoleId && (
                <div className="bg-white p-3 rounded-lg">
                  <label className="block font-medium text-custom-sidebar mb-2 flex items-center">
                    <Code size={16} className="mr-2" />
                    Specialization:
                  </label>
                  <div className="flex flex-col space-y-2">
                    {['react', 'python', 'flutter'].map((spec) => (
                      <label key={spec} className="flex items-center bg-gray-50 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <input 
                          type="checkbox" 
                          value={spec} 
                          checked={formData.specialization.includes(spec)} 
                          onChange={handleSpecializationChange} 
                          className="mr-2 accent-blue-600" 
                        />
                        <div className="flex items-center">
                          {getSpecIcon(spec)}
                          <span className="ml-2">{spec.charAt(0).toUpperCase() + spec.slice(1)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  className="bg-gray-300 text-custom-sidebar px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-sidebar text-white px-4 py-2 rounded-lg hover:bg-sidebar-hover transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;