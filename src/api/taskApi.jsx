import axios from "axios";
import { API_URL } from '../utils/constants';
import { refreshAccessToken } from './authApi' 

export const fetchDevelopersByProject = async (projectId) => {
  let accessToken = localStorage.getItem("access_token");
  
  try {
    const response = await axios.get(`${API_URL}/api/projects/${projectId}/developers/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;

  } catch (error) {
    if (error.response && error.response.status === 401) {
     
      try {
        accessToken = await refreshAccessToken();
        
        // Retry API request with new token
        const retryResponse = await axios.get(`${API_URL}/api/projects/${projectId}/developers/`, {
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
      console.error("Error fetching developers:", error.response?.data || error.message);
      throw new Error("Failed to load developers. Please try again.");
    }
  }
};




// Function to fetch developer tasks
export const listDeveloperTasks = async () => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/developer/tasks/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data; // Return task data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        accessToken = await refreshAccessToken(); // Refresh token
        const retryResponse = await axios.get(`${API_URL}/api/developer/tasks/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return retryResponse.data;
      } catch (refreshError) {
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/developer/tasks/${taskId}/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to fetch task details");
  }
};


export const DeleteTaskById = async (taskId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.delete(`${API_URL}/api/pm/soft-delete-task/${taskId}/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to delte task ");
  }
};

export const DeleteModuleById = async (moduleId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.delete(`${API_URL}/api/modules/${moduleId}/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to delte module ");
  }
};



export const listTaskByBug = async () => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/dev/tasks-with-bugs/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        accessToken = await refreshAccessToken(); 
        const retryResponse = await axios.get(`${API_URL}/api/dev/tasks-with-bugs/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return retryResponse.data;
      } catch (refreshError) {
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw error;
  }
};


export const getBugDetail = async (taskId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/dev/task-bugs/${taskId}/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to fetch task details");
  }
};



export const updateTaskStatus = async (taskId, newStatus) => {
  let accessToken = localStorage.getItem("access_token");
  
  
  const numericId = taskId.toString().replace(/\D/g, '');
  
  try {
    const response = await axios.patch(
      `${API_URL}/api/developer/tasks/${numericId}/update-status/`,
      { status: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        // Refresh token
        accessToken = await refreshAccessToken();
        localStorage.setItem("access_token", accessToken);
        
        // Retry the request with new token
        const retryResponse = await axios.patch(
          `${API_URL}/api/developer/tasks/${numericId}/update-status/`,
          { status: newStatus },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      console.error("Error updating task status:", error);
      throw new Error(
        error.response?.data?.detail || 
        `Failed to update task status (${error.response?.status || "unknown error"})`
      );
    }
  }
};


// export const updateFixedTaskStatus = async (bugId, newStatus) => {
//   let accessToken = localStorage.getItem("access_token");

//   try {
//     const response = await axios.patch(
//       `${API_URL}/api/dev/bugs/update/${bugId}/`,
//       { status: newStatus },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       try {
//         // Refresh token
//         accessToken = await refreshAccessToken();
//         localStorage.setItem("access_token", accessToken); // Store new token

//         // Retry the request
//         const retryResponse = await axios.patch(
//           `${API_URL}/api/dev/bugs/update/${bugId}/`,
//           { status: newStatus },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         return retryResponse.data;
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         throw new Error("Session expired. Please log in again.");
//       }
//     } else {
//       console.error("Error updating task status:", error.response?.data || error.message);
//       throw new Error("Failed to update task status.");
//     }
//   }
// };



export const updateFixedTaskStatus = async (bugId, newStatus, resolutionNotes = "") => {
  let accessToken = localStorage.getItem("access_token");
  
  try {
    // Use bug.id instead of bug.bug_id for the API call
    const response = await axios.patch(
      `${API_URL}/api/dev/bugs/update/${bugId}/`, // Keep the original URL pattern
      { 
        fix_status: newStatus,
        resolution_notes: resolutionNotes 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        // Refresh token
        accessToken = await refreshAccessToken();
        localStorage.setItem("access_token", accessToken);
        
        // Retry with the same URL
        const retryResponse = await axios.patch(
          `${API_URL}/api/dev/bugs/update/${bugId}/`,
          { 
            fix_status: newStatus,
            resolution_notes: resolutionNotes 
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      console.error("Error updating bug status:", error.response?.data || error.message);
      throw new Error(`Failed to update bug status: ${error.response?.data?.error || error.message}`);
    }
  }
};

// Function to fetch tasks
export const getTasks = async () => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/developer/track_task_list/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Pass the token in the header
      },
    });
    
    // Check if the response contains the expected 'tasks' array
    if (response.data && Array.isArray(response.data.tasks)) {
      return response.data;  // Return the full response containing the tasks array
    } else {
      throw new Error("Tasks data is not in the expected format");
    }
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        accessToken = await refreshAccessToken();  // Refresh the token

        // Store the new access token in localStorage
        localStorage.setItem("access_token", accessToken);

        // Retry the request with the new access token
        const retryResponse = await axios.get(`${API_URL}/api/developer/track_task_list/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Pass the new token
          },
        });

        return retryResponse.data;  // Return the updated tasks data
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Session expired. Please log in again.");
      }
    }

    console.error("Error fetching tasks:", error.message);  // Log the error message
    throw new Error("Failed to fetch tasks. Please try again.");
  }
};


