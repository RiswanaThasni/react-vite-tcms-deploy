import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiX, FiEye, FiEyeOff, FiPlus, FiTrash, FiUser } from "react-icons/fi";
import { logoutUser } from "../../../redux/slices/userSlice";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchUserNotifications, markNotificationsRead } from "../../../redux/slices/notificationSlice";
import { fetchUserProfile } from "../../../redux/slices/profileSlice";
import { changePassword, removeProfileImg, updateProfileImg } from "../../../api/userApi";
import { API_URL } from "../../../utils/constants";


const NavBar = ({ toggleSidebar, selectedPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add this selector
  const profileData = useSelector((state) => state.profile.data);
  const user = useSelector((state) => state.auth.user);
  const { list: notifications, unreadCount } = useSelector((state) => state.notifications);

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // State to toggle upload/delete options
  
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const profilePicture = profileData?.profile_picture || user?.profile_picture;
  const profileImageSrc = profilePicture ? `${API_URL}${profilePicture}` : "/public/default.svg";
    

  useEffect(() => {
    dispatch(fetchUserNotifications());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleOpenNotifications = () => {
    setShowNotifications((prev) => !prev);

    if (!showNotifications) {
      dispatch(fetchUserNotifications());
    }

    if (unreadCount > 0) {
      notifications.forEach((notif) => {
        if (notif.status === "unread") {
          dispatch(markNotificationsRead(notif.id));
        }
      });
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleOpenProfile = () => {
    setShowProfile((prev) => !prev);
    
    if (!showProfile) {
      dispatch(fetchUserProfile());
      // Reset password fields when opening profile
      setShowPasswordFields(false);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_new_password: ""
      });
      setErrors({});
      setChangeSuccess(false);
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(prev => !prev);
    if (showPasswordFields) {
      // Reset form when collapsing
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_new_password: ""
      });
      setErrors({});
      setChangeSuccess(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    
    // Validate passwords
    const validationErrors = {};
    if (!passwordData.old_password) {
      validationErrors.old_password = "This field is required.";
    }
    if (!passwordData.new_password) {
      validationErrors.new_password = "This field is required.";
    }
    if (!passwordData.confirm_new_password) {
      validationErrors.confirm_new_password = "This field is required.";
    } else if (passwordData.new_password !== passwordData.confirm_new_password) {
      validationErrors.confirm_new_password = "Passwords do not match.";
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // Updated to pass the password data to the API call
      await changePassword(passwordData);
      setChangeSuccess(true);
      
      // Reset form after successful submission
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_new_password: ""
      });
      
      // Automatically redirect to login after 2 seconds
      setTimeout(() => {
        handleLogout();
      }, 2000);
      
    } catch (error) {
      // Handle API error responses
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Failed to change password. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Close profile popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target) && !event.target.closest(".profile-toggle")) {
        setShowProfile(false);
        setShowOptions(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target) && !event.target.closest(".notification-toggle")) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoading]);

  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await updateProfileImg(file);
        dispatch(fetchUserProfile());
      } catch (error) {
        console.error("Failed to upload profile image:", error);
      }
    }
  };
 
  const handleRemoveProfileImage = async () => {
    try {
      await removeProfileImg();
      dispatch(fetchUserProfile()); // Refresh the profile
    } catch (error) {
      console.error("Failed to remove profile image:", error);
    }
  };

  return (
<div className="fixed top-0 right-0 left-[13rem] bg-mainsection py-4 px-6 flex items-center justify-between z-40">     
{/* Left Section - Dynamic Title with better styling */}
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 hover:bg-blue-100 rounded-lg transition-colors" onClick={toggleSidebar}>
          <FiMenu size={22} className="text-indigo-600" />
        </button>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">
            {selectedPage}
          </span>
        </div>
      </div>

      {/* Right Section with improved spacing */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell with improved styling */}
        <div className="relative">
          <button 
            className="p-2 hover:bg-blue-100 rounded-full transition-all notification-toggle flex items-center justify-center"
            onClick={handleOpenNotifications}
          >
            <FaBell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown with improved styling */}
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 top-12 w-72 bg-white rounded-lg p-3 z-50 max-h-80 overflow-y-auto shadow-lg border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2 pb-2 border-b">
                <h3 className="text-md font-bold text-gray-800">Notifications</h3>
                <span className="text-xs text-blue-600 font-medium">{notifications.length} messages</span>
              </div>
              {notifications.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-gray-500 text-sm">No new notifications</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <li key={notif.id} className="py-3 hover:bg-gray-50 rounded px-2">
                      <a href={notif.link} className="text-gray-700 text-sm block hover:text-blue-600">
                        {notif.message}
                      </a>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}  
        </div>
        
        {/* Profile Image with improved styling */}
        <button 
          className="profile-toggle flex items-center space-x-2 hover:bg-blue-100 rounded-full p-1 transition-colors"
          onClick={handleOpenProfile}
        >
          <img 
            src={profileImageSrc} 
            alt="profile" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" 
          />
        </button>
      </div>

      {/* Profile Popup with improved styling */}
      {showProfile && (
        <div
          ref={profileRef}
          className="fixed top-2 right-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 z-50"
        >
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 pt-5 pb-12 px-4">
            <button 
              onClick={() => setShowProfile(false)} 
              className="absolute top-2 right-2 bg-white/20 p-1 rounded-full hover:bg-white/30 text-white transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
          
          {/* Profile Content */}
          <div className="px-6 -mt-8">
            <div className="flex flex-col items-center">
              {/* Profile Image with Upload/Remove options */}
              <div className="relative mb-2">
                <div className="rounded-full p-1 bg-white shadow-md">
                  <img
                    src={profileImageSrc}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                {/* Upload/Remove Button */}
                <div className="absolute bottom-0 right-0">
                  <button
                    className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => setShowOptions((prev) => !prev)}
                  >
                    <FiPlus size={14} />
                  </button>
                  
                  {showOptions && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32 border border-gray-100 overflow-hidden">
                      <label className="block px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors flex items-center">
                        <FiUser className="mr-2 text-gray-500" size={14} />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileUpload}
                        />
                      </label>
                      <button
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center"
                        onClick={handleRemoveProfileImage}
                      >
                        <FiTrash className="mr-2" size={14} /> Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-lg font-semibold text-gray-800">
                {profileData?.name || user?.name || "User"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {profileData?.email || user?.email || "user@example.com"}
              </p>
            </div>
            
            {/* Change Password Section */}
            <div className="border-t border-gray-100 pt-3 pb-2 mt-1">
              <button
                className="w-full py-2 px-3 text-left text-gray-700 flex items-center justify-between rounded-md hover:bg-gray-50 transition-colors"
                onClick={togglePasswordFields}
              >
                <span className="font-medium text-sm">Change Password</span>
                {showPasswordFields ? (
                  <FiX size={16} className="text-gray-500" />
                ) : (
                  <FiPlus size={16} className="text-gray-500" />
                )}
              </button>
              
              {/* Password Change Fields */}
              {showPasswordFields && (
                <div className="mt-2 px-2 pb-2">
                  {changeSuccess ? (
                    <div className="bg-green-100 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-3 text-sm">
                      Password changed successfully! Redirecting to login...
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-3">
                      {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-2 text-xs">
                          {errors.general}
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible.old ? "text" : "password"}
                            name="old_password"
                            value={passwordData.old_password}
                            onChange={handleInputChange}
                            className={`appearance-none border ${
                              errors.old_password ? "border-red-300 bg-red-50" : "border-gray-200"
                            } rounded-md w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('old')}
                          >
                            {passwordVisible.old ? (
                              <FiEyeOff className="text-gray-400 hover:text-gray-600" size={16} />
                            ) : (
                              <FiEye className="text-gray-400 hover:text-gray-600" size={16} />
                            )}
                          </button>
                        </div>
                        {errors.old_password && (
                          <p className="text-red-500 text-xs mt-1">{errors.old_password}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible.new ? "text" : "password"}
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handleInputChange}
                            className={`appearance-none border ${
                              errors.new_password ? "border-red-300 bg-red-50" : "border-gray-200"
                            } rounded-md w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {passwordVisible.new ? (
                              <FiEyeOff className="text-gray-400 hover:text-gray-600" size={16} />
                            ) : (
                              <FiEye className="text-gray-400 hover:text-gray-600" size={16} />
                            )}
                          </button>
                        </div>
                        {errors.new_password && (
                          <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible.confirm ? "text" : "password"}
                            name="confirm_new_password"
                            value={passwordData.confirm_new_password}
                            onChange={handleInputChange}
                            className={`appearance-none border ${
                              errors.confirm_new_password ? "border-red-300 bg-red-50" : "border-gray-200"
                            } rounded-md w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {passwordVisible.confirm ? (
                              <FiEyeOff className="text-gray-400 hover:text-gray-600" size={16} />
                            ) : (
                              <FiEye className="text-gray-400 hover:text-gray-600" size={16} />
                            )}
                          </button>
                        </div>
                        {errors.confirm_new_password && (
                          <p className="text-red-500 text-xs mt-1">{errors.confirm_new_password}</p>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? "Changing..." : "Change Password"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          
            {/* Logout Button */}
            <div className="py-3 border-t border-gray-100 mt-2">
              <button
                className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;