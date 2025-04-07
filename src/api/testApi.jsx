import axios from "axios"
import {API_URL} from '../utils/constants'
import { refreshAccessToken } from "./authApi"

export const summaryCard = async()=>{
      let accessToken = localStorage.getItem("access_token");

      try{
            const response = await axios.get(`${API_URL}/api/test-cases-summary/`, {
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
        const retryResponse = await axios.get(`${API_URL}/test-cases-summary/`, {
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
      console.error("Error fetching summary cards:", error.response?.data || error.message);
      throw new Error("Failed to load summary cards. Please try again.");
    }
  }
}


export const recentActivity = async ()=>{
      let accessToken = localStorage.getItem("access_token");
      try{
            const response = await axios.get(`${API_URL}/api/test-engineer/recent-activities/`, {
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
        const retryResponse = await axios.get(`${API_URL}/test-engineer/recent-activities/`, {
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
}


      
      
export const upComingDue = async ()=>{
      let accessToken = localStorage.getItem("access_token")
      try{
            const response = await axios.get(`${API_URL}/api/test-engineer/upcoming-due/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/test-engineer/upcoming-due/`, {
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

}


export const testDetails = async()=>{
  let accessToken = localStorage.getItem("access_token")
      try{
            const response = await axios.get(`${API_URL}/api/assigned-tests/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/assigned-tests/`, {
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
      console.error("Error fetching test details:", error.response?.data || error.message);
      throw new Error("Failed to load tests. Please try again.");
    }
  }


}


export const testTrack = async ()=>{
  let accessToken = localStorage.getItem("access_token")
  try{
            const response = await axios.get(`${API_URL}/api/track-assigned-tests/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/track-assigned-tests/`, {
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
      console.error("Error fetching test progress:", error.response?.data || error.message);
      throw new Error("Failed to load tests. Please try again.");
    }
  }


}

export const getTestById = async (testId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/test-cases/${testId}/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch{
    if (error.response && error.response.status === 401) {
          try {
accessToken = await refreshAccessToken();

// Retry API request with new token
const retryResponse = await axios.get(`${API_URL}/api/test-cases/${testId}/`, {
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
console.error("Error fetching test progress:", error.response?.data || error.message);
throw new Error("Failed to load tests. Please try again.");
}
}


}



export const updateTestStep = async (stepId, status, remark) => {
  let accessToken = localStorage.getItem("access_token");
  
  // Match the backend's expected payload structure
  const payload = {
    status: status,  // 'pass' or 'fail'
    remarks: remark || ""  // Changed from "remark" to "remarks" to match backend
  };
  
  try {
    const response = await axios.patch(
      `${API_URL}/api/test-steps/update-status/${stepId}/`,
      payload,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    // Error handling logic remains the same
    if (error.response && error.response.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        const retryResponse = await axios.patch(
          `${API_URL}/api/test-steps/update-status/${stepId}/`,
          payload,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      console.error("Error updating test step:", error.response?.data || error.message);
      throw new Error("Failed to update test step. Please try again.");
    }
  }
};


export const completeTestCase = async (userTestCaseId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.post(
      `${API_URL}/api/complete-test-case/${userTestCaseId}/`, 
      {}, // No body, just updating the status
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        const retryResponse = await axios.post(
          `${API_URL}/api/complete-test-case/${userTestCaseId}/`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      console.error("Error completing test case:", error.response?.data || error.message);
      throw new Error("Failed to complete test case. Please try again.");
    }
  }
};

export const completeTestCases = async (userTestCaseId, status = "completed", bugData = null, attachment = null) => {
  let accessToken = localStorage.getItem("access_token");
  
  try {
    const formData = new FormData();
    formData.append("status", status);
    
    // Add remarks if they exist in bugData
    if (bugData && bugData.remarks) {
      formData.append("remarks", bugData.remarks);
    }
    
    // If bug data exists, add it as a stringified JSON
    if (bugData) {
      formData.append("bug", JSON.stringify(bugData));
    }
    
    // If attachment exists, add it
    if (attachment) {
      formData.append("attachment", attachment);
    }
    
    const response = await axios.post(
      `${API_URL}/api/complete-test-case/${userTestCaseId}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Failed to report bug");
  }
};

// export const completeTestCase = async (userTestCaseId, status = "Completed") => {
//   let accessToken = localStorage.getItem("access_token");
  
//   try {
//     // Changed endpoint to match what backend expects
//     const response = await axios.post(
//       `${API_URL}/api/test-cases/${userTestCaseId}/update-status/`,
//       { status }, 
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       try {
//         accessToken = await refreshAccessToken();
//         const retryResponse = await axios.post(
//           `${API_URL}/api/test-cases/${userTestCaseId}/update-status/`,
//           { status },
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }
//         );
//         return retryResponse.data;
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         throw new Error("Session expired. Please log in again.");
//       }
//     } else {
//       console.error("Error completing test case:", error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || "Failed to complete test case. Please try again.");
//     }
//   }
// };

export const reportBug = async (testId, formData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    const response = await axios.post(
      `${API_URL}/api/complete-test-case/${testId}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to report bug");
  }
};



export const QasummaryCard = async()=>{
  let accessToken = localStorage.getItem("access_token");

  try{
        const response = await axios.get(`${API_URL}/api/qa/test-case-stats/`, {
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
    const retryResponse = await axios.get(`${API_URL}/api/qa/test-case-stats/`, {
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
  console.error("Error fetching summary cards:", error.response?.data || error.message);
  throw new Error("Failed to load summary cards. Please try again.");
}
}
}



export const QaRecentActivity = async ()=>{
  let accessToken = localStorage.getItem("access_token");
  try{
        const response = await axios.get(`${API_URL}/api/qa/recent-test-cases/`, {
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
    const retryResponse = await axios.get(`${API_URL}/api/qa/recent-test-cases/`, {
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
  console.error("Error fetching recent activity:", error.response?.data || error.message);
  throw new Error("Failed to load recent actiivtiy. Please try again.");
}
}
}


export const QaUpComingDue = async ()=>{
  let accessToken = localStorage.getItem("access_token")
  try{
        const response = await axios.get(`${API_URL}/api/qa/upcoming-test-deadlines/`, {
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
    const retryResponse = await axios.get(`${API_URL}/api/qa/upcoming-test-deadlines/`, {
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
  console.error("Error fetching upcoming deadline:", error.response?.data || error.message);
  throw new Error("Failed to load deadline. Please try again.");
}
}

}

export const getFailedTestCases = async (moduleId) => {
  let accessToken = localStorage.getItem("access_token");
  
  try {
    const response = await axios.get(`${API_URL}/api/modules/${moduleId}/failed-test-cases/`, {
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
      console.error("Error fetching failed test cases:", error.response?.data || error.message);
      throw new Error("Failed to load failed test cases. Please try again.");
    }
  }
};


export const getTestCaseBugs = async (testCaseId) => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/test-cases/${testCaseId}/bugs/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/test-cases/${testCaseId}/bugs/`, {
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
      console.error("Error fetching bugs:", error.response?.data || error.message);
      throw new Error("Failed to load bugs. Please try again.");
    }
  }
};


// export const getBugDetails = async (bugId) => {
//   let accessToken = localStorage.getItem("access_token");

//   try {
//     const response = await axios.get(`${API_URL}/api/bugs/${bugId}/`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       try {
//         accessToken = await refreshAccessToken();

//         // Retry API request with new token
//         const retryResponse = await axios.get(`${API_URL}/api/bugs/${bugId}/`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         return retryResponse.data;
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         throw new Error("Session expired. Please log in again.");
//       }
//     } else {
//       console.error("Error fetching bug details:", error.response?.data || error.message);
//       throw new Error("Failed to load bug details. Please try again.");
//     }
//   }
// };



export const getBugDetails = async (bugId) => {
  // Validate bugId before making the API call
  if (!bugId || bugId === 'undefined') {
    console.error("Invalid bug ID:", bugId);
    throw new Error("Bug ID is missing or invalid");
  }

  let accessToken = localStorage.getItem("access_token");
  
  try {
    const response = await axios.get(`${API_URL}/api/bugs/${bugId}/`, {
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
};


export const fetchTestByModule = async (moduleId) => {
  let accessToken = localStorage.getItem("access_token");
  
  try {
    const response = await axios.get(`${API_URL}/api/modules/${moduleId}/testcases/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/modules/${moduleId}/testcases/`, {
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
      console.error("Error fetching failed test cases:", error.response?.data || error.message);
      throw new Error("Failed to load failed test cases. Please try again.");
    }
  }
};


export const QaSummaryReport = async () => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/qa-dashboard-report/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/qa-dashboard-report/`, {
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
      console.error("Error fetching summary:", error.response?.data || error.message);
      throw new Error("Failed to load summary. Please try again.");
    }
  }
};



export const QaFailedTestReport = async () => {
  let accessToken = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`${API_URL}/api/qa/failed-testcases/`, {
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
        const retryResponse = await axios.get(`${API_URL}/api/qa/failed-testcases/`, {
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
      console.error("Error fetching failed testcase:", error.response?.data || error.message);
      throw new Error("Failed to load failed testcase. Please try again.");
    }
  }
};
