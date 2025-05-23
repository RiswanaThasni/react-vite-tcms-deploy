import React, { useEffect, useState } from 'react'
import { fetchUserDetails } from '../../../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Check, X } from 'lucide-react'
import { API_URL } from '../../../utils/constants'
import { updateUser } from '../../../api/userApi'
import { fetchRole } from '../../../api/userApi'

const UserDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {userId} = useParams()
  const { selectedUser, loading, error } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [roles, setRoles] = useState([]); // State to store roles
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

     
  useEffect(()=>{
    // Fetch user details and roles
    dispatch(fetchUserDetails(userId))
    
    // Fetch roles
    const loadRoles = async () => {
      try {
        const fetchedRoles = await fetchRole();
        setRoles(fetchedRoles);
        setRolesLoading(false);
      } catch (error) {
        setRolesError(error);
        setRolesLoading(false);
      }
    };
    loadRoles();
  },[dispatch,userId])

  useEffect(() => {
  if (selectedUser) {
    const currentRole = roles.find(role => role.name === selectedUser.role);
    setEditedData({
      firstName: selectedUser.first_name || "",
      lastName: selectedUser.last_name || "",
      role: currentRole ? currentRole.id : roles.length > 0 ? roles[0].id : "",
      specialization: selectedUser.specialization || "",
      status: selectedUser.status || "Inactive",  
      email: selectedUser.email
    });
  }
}, [selectedUser, roles]);



  if (loading || rolesLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (rolesError) return <p>Error loading roles: {rolesError.message}</p>;
  if (!selectedUser) return <p>No user found</p>;

  const handleBackClick = ()=>{
    navigate(`/admin_dashboard/user_management`)
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // Reset to original values
    const currentRole = roles.find(role => role.name === selectedUser.role);
    setEditedData({
     firstName: selectedUser.first_name || "",
lastName: selectedUser.last_name || "",

      role: currentRole ? currentRole.id : null,
      specialization: selectedUser.specialization || "",
      status: selectedUser.status || "",
      email: selectedUser.email
    });
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
  try {
    const updateData = {
      first_name: editedData.firstName,
      last_name: editedData.lastName,
      role: editedData.role,
      specialization: editedData.specialization || null,
      status: editedData.status,
      email: editedData.email
    };

    await updateUser(userId, updateData);
    setIsEditing(false);
    dispatch(fetchUserDetails(userId));
  } catch (error) {
    console.error("Update failed:", error);
  }
};
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleStatusToggle = () => {
    const statusToChange = editedData.status === "active" ? "inactive" : "active";
    setNewStatus(statusToChange);
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    try {
      setEditedData(prev => ({ ...prev, status: newStatus }));
      
      const updatePayload = { status: newStatus };
      await updateUser(userId, updatePayload);
      
      dispatch(fetchUserDetails(userId));
      
      // Close  dialog
      setShowConfirmation(false);
      
    } catch (error) {
      console.error("Status update failed:", error);
      setShowConfirmation(false);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmation(false);
    setNewStatus('');
  };




  return (
    <div className=''>
    <div className={`p-4 transition-all duration-300 ${showConfirmation ? 'blur-xs pointer-events-none' : ''}`}>
    <button
        onClick={handleBackClick}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
      >
        <ArrowLeft size={12} className="mr-1" />
        Back to User List
      </button>
      <div className="flex flex-col gap-6 items-start w-full max-w-2xl">
        {/* User Profile Section */}
        <div className="border border-dashed rounded-2xl bg-gray-50 border-gray-200 p-6 flex flex-row items-center w-full">
  <img
    src={selectedUser.profile_picture ? `${API_URL}${selectedUser.profile_picture}` : "/default.svg"}
    alt="Profile"
    className="w-18 h-18 rounded-full object-cover"
  />
  
  <div className="p-4 text-sm font-medium">
    <p>{selectedUser.name}</p>
    <p>{selectedUser.role}</p>
  </div>

<button
            onClick={handleStatusToggle}
            className={`ml-auto flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              editedData.status === "active" 
                ? "bg-green-200 text-green-800" 
                : "bg-red-200 text-red-800"
            }`}
          >
            {editedData.status}
          </button>


</div>

        {/* User Details Section */}
        <div className='border border-dashed rounded-2xl border-gray-200 p-6 bg-gray-50 w-full'>
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm">Personal Information</p>
            {!isEditing ? (
              <button 
                onClick={handleEditClick} 
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil size={16} />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSaveClick} 
                  className="text-green-500 hover:text-green-700"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={handleCancelClick} 
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="font-semibold text-sm">User Id:</label>
              <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.user_id || "N/A"}</p>
            </div>

            <div>
              <label className="font-semibold text-sm">Username:</label>
              <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.username || "N/A"}</p>
            </div>

            <div>
              <label className="font-semibold text-sm">First Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedData.firstName}
                  onChange={handleChange}
                  className="w-full bg-white border rounded-md px-2 py-1"
                />
              ) : (
                <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.name.split(" ")[0]}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-sm">Last Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedData.lastName}
                  onChange={handleChange}
                  className="w-full bg-white border rounded-md px-2 py-1"
                />
              ) : (
                <p className="bg-gray-200 px-2 py-1 rounded-md">
                  {selectedUser.name.split(" ").slice(1).join(" ") || "N/A"}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-sm">Email:</label>
              
                <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.email}</p>
              
            </div>

            <div>
              <label className="font-semibold text-sm">Last Login:</label>
              
                <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.last_login}</p>
              
            </div>

            <div>
              <label className="font-semibold text-sm">Role:</label>
              {isEditing ? (
                  <select
  name="role"
  value={editedData.role || ""}
  onChange={handleChange}
  className="w-full bg-white border rounded-md px-2 py-1"
>
  <option value="" disabled>Select a role</option>
  {roles.map((role) => (
    <option key={role.id} value={role.id}>
      {role.role_name}
    </option>
  ))}
</select>

              ) : (
                <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.role}</p>
              )}
            </div>

            {selectedUser.role === "Developer" && (
              <div>
                <label className="font-semibold text-sm">Specialization:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={editedData.specialization}
                    onChange={handleChange}
                    className="w-full bg-white border rounded-md px-2 py-1"
                  />
                ) : (
                  <p className="bg-gray-200 px-2 py-1 rounded-md">{selectedUser.specialization || "N/A"}</p>

                )}
              </div>

            )}

            
          </div>
        </div>
      </div>

    </div>
     
      {showConfirmation && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-2 max-w-md w-full">
            <h3 className="text-sm font-semibold mb-4">Confirm Status Change</h3>
            <p className="mb-6 text-sm">
              Are you sure you want to change this user's status to 
              <span className={`font-bold ${newStatus === 'active' ? 'text-green-600' : 'text-red-600'} mx-1`}>
                {newStatus}
              </span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelStatusChange}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-3 py-1  text-sm rounded-md text-white ${
                  newStatus === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDetails