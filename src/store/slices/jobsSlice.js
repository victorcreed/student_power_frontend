import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { jobService } from '../../services/jobService';

export const fetchPublicJobs = createAsyncThunk(
  'jobs/fetchPublicJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setJobLoading(true));
      const response = await jobService.getJob(id);
      
      if (!response.data || !response.data.success) {
        return rejectWithValue('Job not found');
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.status === 404 
        ? 'The job listing no longer exists or has been removed' 
        : error.response?.data?.message || 'Failed to fetch job details';
      
      return rejectWithValue(errorMessage);
    } finally {
      setTimeout(() => dispatch(setJobLoading(false)), 300);
    }
  }
);

const initialState = {
  jobs: [],
  selectedJob: null,
  count: 0,
  status: 'idle',
  jobStatus: 'idle',
  error: null,
  jobError: null
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
      state.jobStatus = 'idle';
      state.jobError = null;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.data || [];
      state.count = action.payload.count || 0;
      state.status = 'succeeded';
    },
    setJobLoading: (state, action) => {
      state.jobStatus = action.payload ? 'loading' : state.jobStatus;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload?.data || [];
        state.count = action.payload?.count || 0;
        state.error = null;
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch jobs';
      })
      .addCase(fetchJobById.pending, (state) => {
        state.jobStatus = 'loading';
        state.jobError = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobStatus = 'succeeded';
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobStatus = 'failed';
        state.jobError = action.payload || 'Failed to fetch job details';
        state.selectedJob = null;
      });
  }
});

export const { clearSelectedJob, setJobs, setJobLoading } = jobsSlice.actions;
export default jobsSlice.reducer;
