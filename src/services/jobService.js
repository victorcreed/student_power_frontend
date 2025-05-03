import api from './api';
import { API_ENDPOINTS } from './api/config';

export const jobService = {
  getJobs: ({ page = 1, limit = 10, status, schoolId }) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (status) params.append('status', status);
    if (schoolId) params.append('schoolId', schoolId);
    
    return api.get(`${API_ENDPOINTS.JOBS.LIST}?${params.toString()}`);
  },
  
  getJob: (id) => api.get(API_ENDPOINTS.JOBS.DETAILS(id)),
  
  createJob: (jobData) => api.post(API_ENDPOINTS.JOBS.CREATE, jobData),
  
  updateJob: (id, jobData) => api.put(API_ENDPOINTS.JOBS.UPDATE(id), jobData),
  
  deleteJob: (id) => api.delete(API_ENDPOINTS.JOBS.DELETE(id)),
  
  applyToJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  
  getStudentApplications: (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    return api.get(`/applications?${params.toString()}`);
  },
  
  getJobApplications: (jobId, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    return api.get(`/jobs/${jobId}/applications?${params.toString()}`);
  },
  
  getAccessibleJobApplications: (jobId, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    return api.get(`/jobs/${jobId}/applicants?${params.toString()}`);
  },
  
  approveJob: (jobId) => api.post(`/jobs/${jobId}/approve`),
};
