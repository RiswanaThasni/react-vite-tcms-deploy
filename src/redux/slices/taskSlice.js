import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasksByModuleId } from "../../api/projectApi";
import { getTasks } from "../../api/taskApi";

// Fetch tasks by module ID
export const fetchTasksByModule = createAsyncThunk(
  "tasks/fetchTasksByModule",
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await fetchTasksByModuleId(moduleId); // API call to get tasks by module ID
      if (Array.isArray(response)) {
        return response;
      }
      return rejectWithValue("Tasks not found or invalid response");
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching tasks by module");
    }
  }
);

// Fetch all tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  try {
    const response = await getTasks(); // Call the API function to fetch all tasks
    if (response && Array.isArray(response.tasks)) {
      return response.tasks; // Return the tasks array from the response
    } else {
      throw new Error("Tasks data is not in the expected format");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error.message);  // Log the error message
    throw new Error(error.message); // Propagate the error
  }
});


const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks by module
      .addCase(fetchTasksByModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByModule.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Update state with the fetched tasks
      })
      .addCase(fetchTasksByModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks by module"; // Display the error message
      })
      
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Update state with the fetched tasks
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks"; // Display the error message
      });
  },
});

export default taskSlice.reducer;
