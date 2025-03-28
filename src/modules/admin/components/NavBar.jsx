import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiPlus, FiTrash } from "react-icons/fi";
import { fetchUserProfile } from "../../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants"
import { removeProfileImg, updateProfileImg } from "../../../api/userApi";




const NavBar = ({ selectedPage, toggleSidebar }) => {
  const { loggedInUser } = useSelector((state) => state.user);

 
  
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileData = useSelector((state) => state.profile.data);
  const user = useSelector((state) => state.auth.user);
   const profilePicture = profileData?.profile_picture || user?.profile_picture;
const profileImageSrc = profilePicture ? `${API_URL}${profilePicture}` : "/public/default.svg"

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  

  const handleOpenProfile = () => {
    setShowProfile((prev) => !prev);
    
    if (!showProfile) {
      dispatch(fetchUserProfile());
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target) && !event.target.closest(".profile-toggle")) {
        setShowProfile(false);
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
    <div className="fixed top-0 left-0 md:left-20 bg-white w-full md:w-[calc(100%-5rem)] py-4 px-6 flex items-center justify-between z-50">
      {/* Left Section - Dynamic Title */}
      <div className="flex items-center space-x-3">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <FiMenu size={24} className="text-custom-dark text-[#4c6bdd]" />
        </button>
        <span className="text-xl font-bold text-custom1">
          {selectedPage}
        </span>
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
          className="fixed top-0 right-0 h-min w-50 rounded-lg bg-white shadow-lg p-6 transition-transform transform translate-x-0 z-50"
        >
          <div className="flex flex-col items-center mt-6">
          <div className="relative">
              <img
                src={profileImageSrc}
                alt="profile"
                className="w-20 h-20 rounded-full bg-amber-800"
              />

              {/* Upload/Remove Button */}
              <div className="absolute bottom-0 right-0">
                <button
                  className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                  onClick={() => setShowOptions((prev) => !prev)}
                >
                  <FiPlus size={14} />
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
            
            
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;