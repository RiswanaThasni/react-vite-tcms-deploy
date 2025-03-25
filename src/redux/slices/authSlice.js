import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, refreshAccessToken } from "../../api/authApi";

// Async thunk for login
export const login = createAsyncThunk("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await loginUser(username, password);
    return response; // This contains tokens & role
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
  return null;
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    role: localStorage.getItem("role") || null,
    accessToken: localStorage.getItem("access_token") || null,
    refreshToken: localStorage.getItem("refresh_token") || null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
    state.isLoading = false;
    state.user = action.payload.user;  // Store full user object
    state.role = action.payload.role;
    state.accessToken = action.payload.access;
    state.refreshToken = action.payload.refresh;
    
    localStorage.setItem("user", JSON.stringify(action.payload.user)); // Save full user object
    localStorage.setItem("role", action.payload.role);
    localStorage.setItem("access_token", action.payload.access);
    localStorage.setItem("refresh_token", action.payload.refresh);
})


      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.clear();
      });
  },
});

export default authSlice.reducer;
