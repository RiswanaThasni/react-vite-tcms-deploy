import axios from "axios";
import { API_URL } from "../utils/constants";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/login/`, { username, password });

    if (response.status === 200) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.name))
      return response.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid Credintials.");
  }
};




export const forgotPassword = async (email) => {
  try {
      const response = await axios.post(`${API_URL}/api/forgot_password/`, { email });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || "Something went wrong.");
  }
}




export const changePasswordApi = async (uid, token, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/reset-password/`, {
      uid,
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Password reset failed. Please try again.");
  }
};





export const refreshAccessToken = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");
        
        const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
        if (response.status === 200) {
          localStorage.setItem("access_token", response.data.access);
          return response.data.access;
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        throw new Error("Session expired. Please log in again.");
      }
    };



//     export const logoutUser = async () => {
//     try {
//         const refreshToken = localStorage.getItem("refresh_token"); // Get refresh token
//         await axios.post(`${API_URL}/api/logout/`, 
//             { refresh_token: refreshToken }, 
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
//         );
//     } catch (error) {
//         console.error("Logout failed:", error.response?.data || error.message);
//     }
// }

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    
    // Call API to invalidate session (only if refreshToken exists)
    if (refreshToken) {
      await axios.post(`${API_URL}/api/logout/`, 
        { refresh_token: refreshToken }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
    }
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
  } finally {
    // Ensure all authentication data is removed
    localStorage.clear(); // Clears ALL stored keys
  }
};

export const viewProfile = async()=>{
  let accessToken = localStorage.getItem("access_token")
  try{
    const response = await axios.get(`${API_URL}/api/view_profile/`, {
headers: {
Authorization: `Bearer ${accessToken}`,
},
});

return response.data;
}
catch{
    if (error.response && error.response.status === 401) {
          try {
accessToken = await refreshAccessToken();

// Retry API request with new token
const retryResponse = await axios.get(`${API_URL}/api/view_profile/`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

return retryResponse.data;

} catch (refreshError) {
console.error("Token refresh failed:", refreshError);
throw new Error("Session expired. Please log in again.");
}
} else {
console.error("Error fetching profile:", error.response?.data || error.message);
throw new Error("Failed to load profile. Please try again.");
}
}


}