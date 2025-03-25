import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { viewProfile } from '../../api/authApi'

// Async Thunk to Fetch Profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await viewProfile();
      return data; // Return the fetched profile data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Profile Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions & Reducer
export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
