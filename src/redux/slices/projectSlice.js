import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  fetchProjectByLead, fetchProjectByQa, fetchProjects, viewProject } from '../../api/projectApi' 


export const getProjects = createAsyncThunk("projects/getProjects", async (token, { rejectWithValue }) => {
  try {
    const data = await fetchProjects(token);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


export const viewProjectsByProjectManager = createAsyncThunk("projects/viewProjects",async (token,{rejectWithValue}) =>{
  try{
    const data = await viewProject(token)
    return data
  }
  catch (error){
    return rejectWithValue(error.response?.data || error.message)

  }
})

export const viewProjectsByAdmin = createAsyncThunk("projects/viewProjectsByAdmin",async (token,{rejectWithValue}) =>{
  try{
    const data = await viewProject(token)
    return data
  }
  catch (error){
    return rejectWithValue(error.response?.data || error.message)

  }
})

export const getProjectByLead = createAsyncThunk("projects/getProjectByLead", async (token, { rejectWithValue }) => {
  try {
    const data = await fetchProjectByLead(token);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


export const getProjectByQa = createAsyncThunk("projects/getProjectByQa", async (token, { rejectWithValue }) => {
  try {
    const data = await fetchProjectByQa(token);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProjectByLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectByLead.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjectByLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProjectByQa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectByQa.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjectByQa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewProjectsByProjectManager.pending,(state) => {
        state.loading = true
        state.error = null
      })
      .addCase(viewProjectsByProjectManager.fulfilled,(state,action)=>{
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(viewProjectsByProjectManager.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewProjectsByAdmin.pending,(state) => {
        state.loading = true
        state.error = null
      })
      .addCase(viewProjectsByAdmin.fulfilled,(state,action)=>{
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(viewProjectsByAdmin.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default projectSlice.reducer;
