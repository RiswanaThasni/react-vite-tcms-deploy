import axios from "axios";
import { API_URL } from '../utils/constants'

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Function to get the current access token
const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

// Function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post(`${API_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);

    // Update the token in axiosInstance for future requests
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
    console.log("Token refreshed successfully!");
    
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error.response?.data || error.message);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/"; // Redirect to login
    return null;
  }
};

// Add interceptor for handling expired token (401)
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Access token expired, attempting to refresh...");

      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

// API Call: Fetch Roles
export const fetchRole = async () => {
  try {
    const response = await axiosInstance.get("/api/roles/");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const addRole = async (roleName) => {
  try {
    const response = await axiosInstance.post(
      "/api/roles/add/", 
      { role_name: roleName.trim() }, // Ensure it's a string & no extra spaces
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding role:", error.response?.data || error);
    throw error;
  }
};





// API Call: Fetch Users List
export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users_list/");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put("/api/change_password/", passwordData);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// API Call: Fetch Users by Role
export const fetchUsersByRole = async (role = "") => {
  try {
    const response = await axiosInstance.get("/api/users_list/", {
      params: role ? { role } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
};



export const addUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/add-user/", {
      ...userData,
      specialization: userData.specialization, // Already converted to a string
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add user");
  }
};

// API Call: Update User Status
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await axiosInstance.patch(`/api/edit_user/${userId}/`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

// API Call: View Profile
export const viewProfile = async () => {
  try {
    const response = await axiosInstance.get("/api/view_profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    throw new Error("Failed to fetch profile");
  }
};


export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/delete-user/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to delete user");
  }
}