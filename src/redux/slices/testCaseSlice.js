import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTestCaseByModuleId } from '../../api/projectApi';
import { testTrack } from '../../api/testApi';

export const fetchTestCases = createAsyncThunk(
  'tests/fetchTestCases',
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await fetchTestCaseByModuleId(moduleId);
      if (Array.isArray(response)) {
        return response;
      }
      return rejectWithValue("Test cases not found or invalid response");
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching test cases by module");
    }
  }
);

export const fetchTests = createAsyncThunk(
  'tests/fetchTests', 
  async () => {
    try {
      const response = await testTrack();
      // Check for the correct structure in the response - it has assigned_test_cases array
      if (response && Array.isArray(response.assigned_test_cases)) {
        // Transform the data to match the expected structure in your component
        const transformedTests = response.assigned_test_cases.map(item => ({
          id: item.test_case.id,
          name: item.test_case.test_title,
          module: item.test_case.module_name,
          priority: item.test_case.priority,
          dueDate: item.test_case.due_date,
          completionPercentage: item.test_case.progress,
          tester: item.test_case.assigned_users[0]?.username || 'Unassigned'
        }));
        
        return transformedTests;
      } else {
        throw new Error("Tests data is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching tests:", error.message);
      throw new Error(error.message);
    }
  }
);

const initialState = {
  tests: [],
  loading: false,
  error: null
};

const testCaseSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestCases.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTestCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload; // Use tests instead of tasks
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tests";
      });
  },
});

export default testCaseSlice.reducer;