import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '../../services/jobService';

export const fetchPublicJobs = createAsyncThunk(
  'jobs/fetchPublic',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params);
      return response;
    } catch (error) {
      const errorValue = error.response?.data || 'Failed to fetch jobs';
      return rejectWithValue(errorValue);
    }
  }
);

const initialState = {
  jobs: [],
  selectedJob: null,
  count: 0,
  status: 'idle',
  error: null
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.data || [];
      state.count = action.payload.count || 0;
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.data || [];
        state.count = action.payload.count || 0;
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch jobs';
      });
  }
});

export const { clearSelectedJob, setJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
