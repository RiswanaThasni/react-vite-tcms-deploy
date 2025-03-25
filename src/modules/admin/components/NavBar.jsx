import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import { logoutUser } from "../../../redux/slices/userSlice";
import { fetchUserProfile } from "../../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";

const NavBar = ({ selectedPage, toggleSidebar }) => {
  const { loggedInUser } = useSelector((state) => state.user);
  
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileData = useSelector((state) => state.profile.data);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
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

  return (
    <div className="fixed top-0 left-0 md:left-20 bg-white w-full md:w-[calc(100%-5rem)] py-4 px-6 flex items-center justify-between z-50">
      {/* Left Section - Dynamic Title */}
      <div className="flex items-center space-x-3">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <FiMenu size={24} className="text-custom-dark text-[#4c6bdd]" />
        </button>
        <span className="text-base font-medium text-custom1">
          {selectedPage}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-8">
        <img 
          src={profileData?.profile_picture || user?.profile_picture} 
          alt="profile" 
          className="w-10 h-10 rounded-full bg-gray-400 cursor-pointer" 
          onClick={handleOpenProfile} 
        />
      </div>

      {/* Side Profile Popup */}
      {showProfile && (
        <div
          ref={profileRef}
          className="fixed top-0 right-0 h-min w-64 bg-white shadow-lg p-6 transition-transform transform translate-x-0 z-50"
        >
          <div className="flex flex-col items-center mt-16">
            <img 
              src={profileData?.profile_picture || user?.profile_picture} 
              alt="profile" 
              className="w-15 h-15 rounded-full bg-amber-800" 
            />
            <p className="mt-2 text-lg font-semibold text-center">
              {profileData?.name || user?.name || "User"}
            </p>
            <p className="text-sm text-gray-600 text-center">
              {profileData?.email || user?.email || "user@example.com"}
            </p>
            
            <button
              className="mt-4 w-full py-2 text-center bg-custom-dark text-white rounded-md hover:bg-gray-900"
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