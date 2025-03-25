import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDevelopersByProject } from '../../api/taskApi'

export const getDevelopersByProject = createAsyncThunk(
  "developers/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      return await fetchDevelopersByProject(projectId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const developerSlice = createSlice({
  name: "developers",
  initialState: { developers: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDevelopersByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDevelopersByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.developers = action.payload;
      })
      .addCase(getDevelopersByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default developerSlice.reducer;
