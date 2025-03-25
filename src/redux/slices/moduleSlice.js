import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCompletedModulesByProjectId, fetchModulesByProjectId } from "../../api/projectApi";


// Async thunk to fetch modules
export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (projectId, { rejectWithValue }) => {
    try {
      return await fetchModulesByProjectId(projectId);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch modules");
    }
  }
);

export const fetchCompletedModules = createAsyncThunk(
  "modules/fetchCompletedModules",
  async (projectId, { rejectWithValue }) => {
    try {
      return await fetchCompletedModulesByProjectId(projectId);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch completed modules");
    }
  }
);

// Async thunk to add a module
export const addModule = createAsyncThunk(
  "modules/addModule",
  async ({ projectId, moduleData }, { rejectWithValue }) => {
    try {
      return await addModuleApi(projectId, moduleData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add module");
    }
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    modules: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle adding a module
      .addCase(addModule.pending, (state) => {
        state.loading = true;
      })
      .addCase(addModule.fulfilled, (state, action) => {
        state.loading = false;
        state.modules.push(action.payload); // Update state with new module
      })
      .addCase(addModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompletedModules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompletedModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchCompletedModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default moduleSlice.reducer;
