import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUsers as fetchUsersApi , deleteUser as deleteUserAPI } from '../../api/userApi'
import { logoutUser as logOutApi } from '../../api/authApi'
import { viewProfile } from '../../api/userApi';
import { viewUserDetails } from '../../api/userApi';


const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null; // Ensure storedUser is not null or undefined
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem("user"); // Remove invalid data
    return null;
  }
};



const initialState = {
      loading :false ,
      users :[],
      error : '',
      loggedInUser: getStoredUser()

};


export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const users = await fetchUsersApi()
    return users
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const fetchUserDetails = createAsyncThunk("user/fetchUserDetails",async(userId,{rejectWithValue}) =>{
  try{
    const user = await viewUserDetails(userId)
    return user
  }
  catch(error){
    return rejectWithValue(error.message || "Failed to fetch user details");
  }
})



export const deleteUser = createAsyncThunk("users/deleteUser", async (userId, { dispatch }) => {
  await deleteUserAPI(userId);
  dispatch(fetchUsers()); // Refresh the user list after deleting
});

export const logoutUser = createAsyncThunk("user/logout",async (_,{rejectWithValue}) =>{
      try{
            const logout = await logOutApi()
            return null
      }
      catch(error){
            return rejectWithValue(error.message || "Logout failed.")

      }
})

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await viewProfile();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
})

const userSlice = createSlice({
  name: 'user',
  
  initialState: {
    loading: false,
    users: [],
    selectedUser: null,
    error: null,
  },  reducers: {
      setUsers : (state,action)=>{
            state.users =action.payload
      },
      setLoggedInUser : (state,action)=>{
            state.loggedInUser =action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
      },
      updateLoggedInUser: (state, action) => {
      state.loggedInUser = { ...state.loggedInUser, ...action.payload }
      localStorage.setItem("user", JSON.stringify(state.loggedInUser))
    },

  },
  extraReducers : (builder)=>{
      builder 
      .addCase(fetchUsers.pending ,(state)=>{
            state.loading = true,
            state.error = null
      })
      .addCase(fetchUsers.fulfilled,(state,action)=>{
            console.log("Fetched Users:", action.payload)
            state.loading = false 
            state.users =action.payload 
      })
      .addCase(fetchUsers.rejected,(state,action)=>{
            state.loading =false,
            state.error = action.payload || "Error fetching users"
      })
      .addCase(logoutUser.fulfilled,(state)=>{
            localStorage.clear()
            state.loggedInUser = null
            state.users =[]
            state.error = ""
            window.location.href = "/"
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user details";
      });
     

  }
});

export const { setUsers,setLoggedInUser,updateLoggedInUser} = userSlice.actions

export default userSlice.reducer
