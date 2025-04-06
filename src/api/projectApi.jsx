import axios from "axios";
import { API_URL } from '../utils/constants';

// Make sure your axios instance has these settings for FormData uploads
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post(`${API_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);

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

export const fetchProjects = async () => {
  try {
    const response = await axiosInstance.get("/api/project_list/");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export const fetchProjectByLead = async()=>{
  try{
    const response = await axiosInstance.get("/api/lead/projects/");
    return response.data;
  }catch(error){
    console.error("Error fetching projects by lead:", error);
    throw error;
  }
}


export const fetchProjectByQa = async()=>{
  try{
    const response = await axiosInstance.get("/api/qa/projects/");
    return response.data;
  }catch(error){
    console.error("Error fetching projects by lead:", error);
    throw error;
  }
}

export const fetchModulesByProjectId = async (projectId) => {
  try {
    const response = await axiosInstance.get(`/api/projects/${projectId}/modules/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching modules by project ID:", error);
    throw error;
  }
}





export const fetchbugsByModuleId = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/api/modules/${moduleId}/unassigned-bugs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bugs by module ID:", error);
    throw error;
  }
}


export const reassignBug = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/pm/bugs/assign/`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error assign the bug to developer:", error);
    throw error;
  }
};

export const fetchCompletedModulesByProjectId = async (projectId) => {
  try {
    const response = await axiosInstance.get(`/api/projects/${projectId}/completed_modules/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching completed modules by project ID:", error);
    throw error;
  }
}


export const fetchTestCaseByModuleId = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/api/modules/${moduleId}/testcases/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching testcases by module ID:", error);
    throw error;
  }
}


export const fetchTestTypes = async () => {
  const response = await axiosInstance.get(`${API_URL}/api/test_types/`);
  return response.data;
};

export const fetchTestEngineers = async (projectId) => {
  const response = await axiosInstance.get(`/api/projects/${projectId}/testEngineers/`);
  return response.data;
};




export const addModuleApi = async (projectId, moduleData) => {
  try {
    const response = await axiosInstance.post(`/api/projects/${projectId}/modules/`, moduleData);
    return response.data;
  } catch (error) {
    console.error("Error adding module:", error);
    throw error;
  }
}

export const fetchTasksByModuleId = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/api/modules/${moduleId}/tasks/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching modules by project ID:", error);
    throw error;
  }
}

export const addTasksByModuleId = async (moduleId, taskData) => {
  try {
    const response = await axiosInstance.post(`/api/modules/${moduleId}/tasks/`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};






export const assignBugTask = async (bugId, taskData) => {
  try {
    // Make sure bugId is valid
    if (!bugId) throw new Error("Bug ID is required");
    
    // Log what we're sending for debugging
    console.log("Sending task data to bug:", bugId);
    
    // Ensure the FormData includes all required fields
    if (!taskData.get('assigned_to')) {
      throw new Error("Developer ID (assigned_to) is required");
    }
    
    // Debug the actual data being sent
    console.log("Full form data being sent:");
    for (let [key, value] of taskData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    const response = await axiosInstance.post(`/api/pm/bugs/assign-bug/${bugId}/`, taskData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error assigning bug task:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      
      if (error.response.status === 400) {
        throw new Error(`Validation error: ${JSON.stringify(error.response.data)}`);
      } else if (error.response.status === 500) {
        throw new Error("Server error. Please try again later or contact the administrator.");
      }
    }
    
    throw error;
  }
};












// export const addTestByModuleId = async (moduleId, testData) => {
//   try {
//     const response = await axiosInstance.post(`/api/modules/${moduleId}/testcases/`, testData);
//     return response.data;
//   } catch (error) {
//     console.error("Error adding testcases by module ID:", error);
//     throw error;
//   }
// }

export const addTestByModuleId = async (moduleId, testData) => {
  try {
    // Option 1: If your backend expects JSON data
    const response = await axiosInstance.post(
      `/api/modules/${moduleId}/testcases/`, 
      testData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding testcases by module ID:", error);
    throw error;
  }
};



// In projectApi.jsx
export const addTestType = async (typeName) => {
  try {
    // Send as an object with a name property instead of a plain string
    const response = await axiosInstance.post('/api/test_types/', { name: typeName });
    return response.data;
  } catch (error) {
    console.error("Error adding test type:", error.response?.data || error);
    throw error;
  }
};


export const fetchProjectManagers = async () => {
      try {
        const response = await axiosInstance.get("/api/project_managers_list/");
        return response.data;
      } catch (error) {
        console.error("Error fetching project managers:", error);
        throw error;
      }
    };
    
    //  Fetch available roles
    export const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/api/roles/");
        return response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
      }
    };
    export const fetchUsersByRole = async (roleId) => {
      try {
        const response = await axiosInstance.get(`/api/users_list_by_role/`, {
          params: { role: roleId }, // Pass role ID
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.error("Error fetching users by role:", error);
        return [];
      }
    };
    
    
    // Create a new project
    export const createProject = async (projectData) => {
      try {
        const response = await axiosInstance.post("/api/projects/create/", projectData);
        console.log("Project Created Successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error creating project:", error.response?.data || error.message);
        throw error;
      }
    }

//    


export const editProject = async(projectId, projectData) => {
  try {
    // Make sure we're using the correct content type
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Log what's being sent
    console.log(`Sending update to: ${API_URL}/api/projects/${projectId}/update/`);
    console.log("With data:", JSON.stringify(projectData));
    
    const response = await axiosInstance.put(
      `${API_URL}/api/projects/${projectId}/update/`, 
      projectData,
      config
    );
    
    return response.data;
  } catch(error) {
    console.error("API Error:", error);
    throw error.response ? error.response.data : new Error("Failed to edit project");
  }
};





export const editTask = async(taskId, taskData) => {
  try {
    let config = {};
    
    // Check if taskData is FormData (for file uploads)
    const isFormData = taskData instanceof FormData;
    
    if (isFormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
    } else {
      config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
    
    // Log what's being sent
    console.log(`Sending update to: ${API_URL}/api/task/${taskId}/update/`);
    if (isFormData) {
      console.log("Sending FormData with file");
    } else {
      console.log("With data:", JSON.stringify(taskData));
    }
    
    const response = await axiosInstance.put(
      `${API_URL}/api/task/${taskId}/update/`, 
      taskData,
      config
    );
    
    return response.data;
  } catch(error) {
    console.error("API Error:", error);
    throw error.response ? error.response.data : new Error("Failed to edit task");
  }
};







    export const deleteProject = async(projectId)=>{
      try{
        const response = await axiosInstance.delete(`${API_URL}/api/project/${projectId}/archive/`)
        return response
      }
      catch(error){

 throw error.response ? error.response.data : new Error("Failed to archive project ");
      }
    }


    export const restoreProject = async(projectId)=>{
      try{
        const response = await axiosInstance.post(`${API_URL}/api/project/${projectId}/restore/`)
        return response
      }
      catch(error){

 throw error.response ? error.response.data : new Error("Failed to restoring project ");
      }
    }

    export const viewProject = async(projectId)=>{
      try{
        const response = await axiosInstance.get(`${API_URL}/api/project/details/${projectId}/`)
        return response
      }
      catch(error){

 throw error.response ? error.response.data : new Error("Failed to fetch project details");
      }
    }


    export const SummaryCardsByAdmin = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/project-stats/");
        return response.data;
      } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
      }
    };
    
    export const RecentActivityAdmin = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/recent-projects/");
        return response.data;
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        throw error;
      }
    };

    export const ListProjectByAdmin = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/recent-projects/", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data; // Ensure the response data is returned properly
      } catch (error) {
        console.error("Error fetching admin projects:", error.response?.data || error);
        throw error;
      }
    };

  

    export const ListProjectAdmin = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/recent-projects/", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        return response; // Return the full response object
      } catch (error) {
        console.error("Error fetching admin projects:", error.response?.data || error);
        throw error;
      }
    };

    export const ProjectSummary = async(projectId)=>{
      try{
        const response = await axiosInstance.get(`${API_URL}/api/project-summary/${projectId}/`)
        return response
      }
      catch(error){

 throw error.response ? error.response.data : new Error("Failed to fetch project details");
      }
    }

    export const ProjectDetailsforAnalysis = async(projectId)=>{
      try{
        const response = await axiosInstance.get(`${API_URL}/api/admin/project-detail/${projectId}/`)
        return response
      }
      catch(error){

 throw error.response ? error.response.data : new Error("Failed to fetch project details");
      }
    }


    export const viewProgressByAdmin = async () => {
      try {
        const response = await axiosInstance.get("/api/pm-projects-graph/", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        return response; 
      } catch (error) {
        console.error("Error fetching  projects progress:", error.response?.data || error);
        throw error;
      }
    };


    export const viewDetailedProgressByAdmin = async (projectId) => {
      try {
        const response = await axiosInstance.get(`/api/projects/${projectId}/stats/`);
        return response.data;
      } catch (error) {
        console.error("Error fetching detailed progress:", error);
        throw error;
      }
    }

    


    export const fetchFailedBugProjects = async () =>{
      try{
        const response = await axiosInstance.get(`/api/PM/project_with_bugs/`)
        return response.data
      }
      catch(error){
        console.error("Error fetching failed projects:",error)
        throw error
      }
    }

    export const fetchFailedBugModules = async (projectId)=>{
      try{
        const response = await axiosInstance.get(`/api/PM/${projectId}/modules_with_bugs/`)
        return response.data
      }
      catch(error){
        console.error("Error fetching failed modules:",error)
        throw error
      }
    }
    



   
    
    

export default axiosInstance;
