import axios from "axios"
import {API_URL} from '../utils/constants'
import { refreshAccessToken } from "./authApi"

export const ListTestCase = async(moduleId)=>{
      let accessToken = localStorage.getItem("access_token");

      try{
            const response = await axios.get(`${API_URL}/api/modules/${moduleId}/failed-test-cases/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/modules/${moduleId}/failed-test-cases/`, {
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
      console.error("Error fetching  failed test case:", error.response?.data || error.message);
      throw new Error("Failed to load failed test case. Please try again.");
    }
  }
}


export const ListBug = async(bugId)=>{
      let accessToken = localStorage.getItem("access_token");

      try{
            const response = await axios.get(`${API_URL}/api/test-cases/${bugId}/bugs/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/test-cases/${bugId}/bugs/`, {
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
      console.error("Error fetching bug:", error.response?.data || error.message);
      throw new Error("Failed to load bugs. Please try again.");
    }
  }
}


export const DetailedBug = async(bugId)=>{
      let accessToken = localStorage.getItem("access_token");

      try{
            const response = await axios.get(`${API_URL}/api/bugs/${bugId}/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/bugs/${bugId}/`, {
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
      console.error("Error fetching bug details:", error.response?.data || error.message);
      throw new Error("Failed to load bug details. Please try again.");
    }
  }
}


export const ReportBug = async (testId, bugData) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.post(`${API_URL}/api/qa-report-bug/${testId}/`, bugData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        
        // Retry API request with new token
        const retryResponse = await axios.post(`${API_URL}/api/qa-report-bug/${testId}/`, bugData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      console.error("Error reporting bug:", error.response?.data || error.message);
      throw error; // Throw the original error to be handled by the caller
    }
  }
};



export const BugByModule = async(moduleId)=>{
  let accessToken = localStorage.getItem("access_token");

  try{
        const response = await axios.get(`${API_URL}/api/modules/${moduleId}/bugs/`, {
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
    const retryResponse = await axios.get(`${API_URL}/api/modules/${moduleId}/bugs/`, {
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
  console.error("Error fetching bug details:", error.response?.data || error.message);
  throw new Error("Failed to load bug details. Please try again.");
}
}
}