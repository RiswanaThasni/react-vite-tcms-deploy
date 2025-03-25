import axios from "axios";
import { API_URL } from "../utils/constants";

// Get tokens from localStorage
const getAuthToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// Refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
    const newAccessToken = response.data.access;

    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/"; // Redirect to login
    throw error;
  }
};

// Handle authenticated requests
const makeAuthenticatedRequest = async (apiCall) => {
  try {
    let token = getAuthToken();

    // 🔹 If access token is missing, try refreshing it
    if (!token && getRefreshToken()) {
      token = await refreshAccessToken();
    }

    // 🔹 If still no token, user is not logged in
    if (!token) throw new Error("No access token available");

    return await apiCall(token);
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        return await apiCall(newToken);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        throw refreshError;
      }
    }
    throw error;
  }
};

export const fetchNotifications = async () => {
  return makeAuthenticatedRequest(async (token) => {
    const response = await axios.get(`${API_URL}/api/notifications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  });
};




// Mark notifications as read
export const markNotificationAsRead = async (notificationId) => {
  return makeAuthenticatedRequest(async (token) => {
    await axios.post(
      `${API_URL}/api/notifications/${notificationId}/mark-as-read/`, // Fixed URL
      {},
      { headers: { Authorization: `Bearer ${token}` } } // Fixed Bearer token syntax
    );
  });
};