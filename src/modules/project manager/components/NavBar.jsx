import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { logoutUser } from "../../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { fetchUserNotifications } from "../../../redux/slices/notificationSlice";
import { fetchUserProfile } from "../../../redux/slices/profileSlice";
import { changePassword } from "../../../api/userApi";

const NavBar = ({ toggleSidebar, selectedPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileData = useSelector((state) => state.profile.data);
  const user = useSelector((state) => state.auth.user);

  const [showProfile, setShowProfile] = useState(false);
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

  useEffect(() => {
    dispatch(fetchUserNotifications());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  

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

  return (
    <div className="fixed top-0 left-45 bg-white md:left-45 w-full md:w-[calc(100%-10rem)] py-4 px-6 flex items-center justify-between z-50">
      {/* Left Section - Dynamic Title */}
      <div className="flex items-center space-x-3">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <FiMenu size={24} className="text-custom-dark !text-[#4c6bdd]" />
        </button>
        <span className="text-2xl font-bold mb-4 text-custom1">
          {selectedPage} {/*  Display Dynamic Page Title */}
        </span>
      </div>

      {/* Right Section */}
      <div className="absolute right-6 top-4 flex items-center space-x-8">
        
        <img 
          src={profileData?.profile_picture || user?.profile_picture } 
          alt="profile" 
          className="w-16 h-16 rounded-full profile-toggle cursor-pointer" 
          onClick={handleOpenProfile} 
        />
      </div>

      {/* Side Profile Popup */}
      {showProfile && (
        <div
          ref={profileRef}
          className="fixed top-0 right-0 h-min w-72 bg-white shadow-lg p-6 transition-transform transform translate-x-0 z-50"
        >
          <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4">
            <FiX size={24} className="text-gray-600" />
          </button>

          <div className="flex flex-col items-center mt-8">
            <img 
              src={profileData?.profile_picture || user?.profile_picture || "https://via.placeholder.com/80"} 
              alt="profile" 
              className="w-16 h-16 rounded-full" 
            />
            <p className="mt-2 text-lg font-semibold text-center">
              {profileData?.name || user?.name || "User"}
            </p>
            <p className="text-sm text-gray-600 text-center mb-6">
              {profileData?.email || user?.email || "user@example.com"}
            </p>
          
            {/* Change Password Section */}
            <div className="w-full border-t border-gray-200 pt-4">
              <button
                className="w-full py-2 text-left font-medium text-custom flex items-center justify-between"
                onClick={togglePasswordFields}
              >
                <span>Change Password</span>
                {showPasswordFields ? (
                  <FiX size={18} className="text-custom" />
                ) : (
                  <span className="text-xl">+</span>
                )}
              </button>
              
              {/* Password Change Fields - Appears in the same profile dropdown */}
              {showPasswordFields && (
                <div className="mt-3 transition-all duration-300 ease-in-out">
                  {changeSuccess ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                      Password changed successfully! Redirecting to login...
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange}>
                      {errors.general && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-xs">
                          {errors.general}
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible.old ? "text" : "password"}
                            name="old_password"
                            value={passwordData.old_password}
                            onChange={handleInputChange}
                            className={`shadow appearance-none border ${
                              errors.old_password ? "border-red-500" : "border-gray-300"
                            } rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('old')}
                          >
                            {passwordVisible.old ? (
                              <FiEyeOff className="text-gray-500" size={16} />
                            ) : (
                              <FiEye className="text-gray-500" size={16} />
                            )}
                          </button>
                        </div>
                        {errors.old_password && (
                          <p className="text-red-500 text-xs italic">{errors.old_password}</p>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible.new ? "text" : "password"}
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handleInputChange}
                            className={`shadow appearance-none border ${
                              errors.new_password ? "border-red-500" : "border-gray-300"
                            } rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {passwordVisible.new ? (
                              <FiEyeOff className="text-gray-500" size={16} />
                            ) : (
                              <FiEye className="text-gray-500" size={16} />
                            )}
                          </button>
                        </div>
                        {errors.new_password && (
                          <p className="text-red-500 text-xs italic">{errors.new_password}</p>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible.confirm ? "text" : "password"}
                            name="confirm_new_password"
                            value={passwordData.confirm_new_password}
                            onChange={handleInputChange}
                            className={`shadow appearance-none border ${
                              errors.confirm_new_password ? "border-red-500" : "border-gray-300"
                            } rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {passwordVisible.confirm ? (
                              <FiEyeOff className="text-gray-500" size={16} />
                            ) : (
                              <FiEye className="text-gray-500" size={16} />
                            )}
                          </button>
                        </div>
                        {errors.confirm_new_password && (
                          <p className="text-red-500 text-xs italic">{errors.confirm_new_password}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="bg-custom hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-sm"
                          disabled={isLoading}
                        >
                          {isLoading ? "Changing..." : "Change Password"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          
            {/* Logout Button */}
            <button
              className="mt-6 w-full py-2 text-center bg-custom-dark text-white rounded-md hover:bg-gray-900"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;