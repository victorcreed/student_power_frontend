export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/signin',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`
  },
  JOBS: {
    LIST: '/jobs',
    CREATE: '/jobs',
    DETAILS: (id) => `/jobs/${id}`,
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`,
    APPROVE: (jobId) => `/jobs/${jobId}/approve`,
    APPROVALS: (jobId) => `/jobs/${jobId}/approvals`,
    SCHOOL_APPROVED_JOBS: '/schools/approved-jobs',
    APPLY: (jobId) => `/jobs/${jobId}/apply`,
    APPLICATIONS: (jobId) => `/jobs/${jobId}/applications`,
    USER_APPLICATIONS: '/users/applications'
  }
};

export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${endpoint}`;
};
