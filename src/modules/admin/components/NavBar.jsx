
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiMenu, FiPlus, FiTrash, FiX } from "react-icons/fi";
import { fetchUserProfile } from "../../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { changePassword, removeProfileImg, updateProfileImg } from "../../../api/userApi";

const NavBar = ({ selectedPage, toggleSidebar }) => {
  const { loggedInUser } = useSelector((state) => state.user);
  const [showProfile, setShowProfile] = useState(false);
  const [showOptions, setShowOptions] = useState(false); 
  const profileRef = useRef(null);

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileData = useSelector((state) => state.profile.data);
  const user = useSelector((state) => state.auth.user);
  const profilePicture = profileData?.profile_picture || user?.profile_picture;
  const profileImageSrc = profilePicture ? `${API_URL}${profilePicture}` : "/default.svg";

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleOpenProfile = () => {
    setShowProfile((prev) => !prev);
    if (!showProfile) {
      dispatch(fetchUserProfile());
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
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest(".profile-toggle")
      ) {
        setShowProfile(false);
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
 {/* Left Section - Dynamic Title */}
      <div className="flex items-center space-x-3">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <FiMenu size={24} className="text-custom-dark text-[#4c6bdd]" />
        </button>
        <span className="text-md font-semibold text-custom-sidebar">{selectedPage}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-8">
        <img
          src={profileImageSrc}
          alt="profile"
          className="w-10 h-10 rounded-full bg-gray-400 cursor-pointer"
          onClick={handleOpenProfile}
        />
      </div>

      {/* Side Profile Popup */}
      {showProfile && (
        <div
          ref={profileRef}
          className="fixed top-2 right-2 h-min w-50 rounded-lg bg-mainsection shadow-lg p-6 transition-transform transform translate-x-0 z-50"
        >
          <div className="flex flex-col items-center mt-3">
            <div className="relative">
              <img
                src={profileImageSrc}
                alt="profile"
                className="w-15 h-15 rounded-full bg-amber-800"
              />

              {/* Upload/Remove Button */}
              <div className="absolute bottom-0 right-0">
                <button
                  className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                  onClick={() => setShowOptions((prev) => !prev)}
                >
                  <FiPlus size={9} />
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-28">
                    <label className="block px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileUpload}
                      />
                    </label>
                    <button
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-200"
                      onClick={handleRemoveProfileImage}
                    >
                      <FiTrash className="inline mr-2" /> Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-2 text-lg font-semibold text-center">
              {profileData?.name || user?.name || "User"}
            </p>
            <p className="text-sm text-gray-600 text-center">
              {profileData?.email || user?.email || "user@example.com"}
            </p>
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

          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
