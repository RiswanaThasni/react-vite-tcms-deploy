import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi";
import { logoutUser } from "../../../redux/slices/userSlice";
import { fetchUserProfile } from "../../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";






const NavBar = ({ toggleSidebar, selectedPage }) => {
  const { loggedInUser } = useSelector((state) => state.user);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileData = useSelector((state) => state.profile.data);
  const user = useSelector((state) => state.auth.user);

const [showProfile, setShowProfile] = useState(false);
        const [showNotifications, setShowNotifications] = useState(false);
      
        const profileRef = useRef(null);
        const notificationRef = useRef(null);

  
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
                                                  dispatch(fetchUserProfile()
                                                ); // Fetch user details when opening profile
                                                }
                                              };

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
       }, []);                                           



  // Close profile popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 left-45 bg-white   md:left-45 w-full md:w-[calc(100%-10rem)] py-4 px-6 flex items-center justify-between z-50">
      {/* Left Section - Dynamic Title */}
      <div className="flex items-center space-x-3">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          {/* <FiMenu size={24} className="text-custom-dark !text-[#4c6bdd]" /> */}
        </button>
        <span className="text-2xl font-bold mb-4 text-custom1">
          {selectedPage} {/*  Display Dynamic Page Title */}
        </span>
      </div>

      {/* Right Section */}
      <div className="absolute  right-10 top-6 flex items-center space-x-8">
       
      <img 
  src={profileData?.profile_picture || user?.profile_picture } 
  alt="profile" 
  className="w-14 h-14 rounded-full bg-gray-400" 
  onClick={handleOpenProfile} 
/>
      </div>

      {/* Side Profile Popup */}
       {showProfile && (
                          <div
                            ref={profileRef}
                            className="fixed top-0 right-0 h-min w-64 bg-white shadow-lg p-6 transition-transform transform translate-x-0 z-50"
                          >
                            <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4">
                              <FiX size={24} className="text-gray-600" />
                            </button>
                  
                            <div className="flex flex-col items-center mt-8">
                  <img 
                    // src={profileData?.profile_picture || user?.profile_picture || "https://via.placeholder.com/80"} 
                    alt="profile" 
                    className="w-16 h-16 rounded-full bg-amber-800" 
                    onClick={handleOpenProfile} 
                  />
                  <p className="mt-2 text-lg font-semibold text-center">
                    {profileData?.name || user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-600 text-center">
                    {profileData?.email || user?.email || "user@example.com"}
                  </p>
                  
                              {/* Change Password Button */}
                              {/* <button
                                className="mt-6 w-full py-2 text-center bg-custom text-white rounded-md hover:bg-blue-600"
                                onClick={() => navigate("/change-password")}
                              >
                                Change Password
                              </button> */}
                  
                              {/* Logout Button */}
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
