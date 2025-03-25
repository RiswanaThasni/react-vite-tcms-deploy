import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotifications, markNotificationAsRead} from "../../api/notificationApi";

export const fetchUserNotifications = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchNotifications(); // No need for userId
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return rejectWithValue(error.response?.data || "Error fetching notifications");
    }
  }
);






// Mark notifications as read
export const markNotificationsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await markNotificationAsRead(notificationId);
      return notificationId; // Return the ID to update Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error marking as read");
    }
  }
);




const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unreadCount: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.list = []; // Reset before fetching
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        console.log("Fetched notifications:", action.payload); // Debugging
        state.list = action.payload || [];
        state.unreadCount = state.list.filter((notif) => notif.status === "unread").length;
        console.log("Updated unread count:", state.unreadCount); // Debugging
      })
      

      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        state.list = state.list.map((notif) =>
          notif.id === action.payload ? { ...notif, status: "read" } : notif // Correctly update status
        );
        state.unreadCount = state.list.filter((notif) => notif.status === "unread").length;
      })
      .addCase(markNotificationsRead.rejected, (state, action) => {
        console.error("Error marking notification as read:", action.payload);
      });
  },
});

export default notificationSlice.reducer;
