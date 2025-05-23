import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
  
  getJob: (id) => {
    return api.get(`/jobs/${id}`);
  },
  
  createJob: (jobData) => {
    return api.post('/jobs', jobData);
  },
  
  updateJob: (id, jobData) => {
    return api.put(`/jobs/${id}`, jobData);
  },
  
  deleteJob: (id) => {
    return api.delete(`/jobs/${id}`);
  },
  
  applyForJob: (jobId, applicationData) => {
    return api.post(`/jobs/${jobId}/applications`, applicationData);
  },
  
  approveJob: (jobId) => {
    return api.patch(`/jobs/${jobId}/approve`);
  },
  
  getApplications: async (params = {}) => {
    try {
      const response = await api.get('/applications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  getJobApplications: async (endpoint, params = {}) => {
    return await api.get(endpoint, { params });
  },

  updateApplicationStatus: async (applicationId, status) => {
    return await api.patch(`/applications/${applicationId}/status`, { status });
  },

  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  apply: async (jobId, data) => {
    const response = await api.post(`/jobs/${jobId}/apply`, data);
    return response.data;
  }
};
