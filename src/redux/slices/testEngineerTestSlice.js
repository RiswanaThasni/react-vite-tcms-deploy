import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { testDetails } from "../../api/testApi"; 

export const fetchTestCaseByTestEngineer = createAsyncThunk(
  "testDetails/fetchTestCaseByTestEngineer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await testDetails();
     
        return response; 
     
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const testCaseSlice = createSlice({
  name: "testDetails",
  initialState: {
    tests: [],
    loading: false,
    error: null,
  },  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestCaseByTestEngineer.pending, (state) => {
            state.loading = true;
            state.error = null;
      })
      .addCase(fetchTestCaseByTestEngineer.fulfilled, (state, action) => {
  state.loading = false;
  state.tests = action.payload.map(item => item.test_case); 
})


      .addCase(fetchTestCaseByTestEngineer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
      });
  },
});

export default testCaseSlice.reducer;
