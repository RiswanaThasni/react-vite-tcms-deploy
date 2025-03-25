import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listDeveloperTasks } from "../../api/taskApi"; //  Import API function

// Async thunk to fetch developer tasks
export const fetchDeveloperTasks = createAsyncThunk(
  "developerTasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const data = await listDeveloperTasks(); //  Use API function
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const developerTaskSlice = createSlice({
  name: "developerTasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeveloperTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeveloperTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchDeveloperTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default developerTaskSlice.reducer;
