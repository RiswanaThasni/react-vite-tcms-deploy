import axios from "axios";
import { API_URL } from '../utils/constants';

// Fetch task status counts
export const fetchTaskStatus = async () => {
  let accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${API_URL}/api/developer/task-status/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task status:", error);
    return { total_tasks: 0, completed_tasks: 0, pending_tasks: 0 };
  }
};

// Fetch recent tasks
export const fetchRecentTasks = async () => {
  let accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${API_URL}/api/developer/recent-tasks/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.recent_tasks;
  } catch (error) {
    console.error("Error fetching recent tasks:", error);
    return [];
  }
};

// Fetch upcoming deadlines
export const fetchUpcomingDeadlines = async () => {
  let accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${API_URL}/api/developer/upcoming-deadlines/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.upcoming_deadlines;
  } catch (error) {
    console.error("Error fetching upcoming deadlines:", error);
    return [];
  }
};
