import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPublicJobs } from '../store/slices/jobsSlice';

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-success';
    case 'expired': return 'bg-warning';
    case 'draft': return 'bg-info';
    case 'closed': return 'bg-secondary';
    default: return 'bg-primary';
  }
};

const JobsPublic = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectJobsState = state =>
    state.jobs ||
    state.jobsSlice ||
    (state.slices && state.slices.jobs) ||
    {};
    
  const { jobs = [], status, error, count = 0 } = useSelector(selectJobsState);
  const isLoading = status === 'loading';
  
  useEffect(() => {
    dispatch(fetchPublicJobs());
  }, [dispatch]);
  
  const filteredJobs = jobs.filter(job => 
    searchTerm === '' || 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.Company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm('');

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Public Job Listings</h2>
        <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-light">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={handleClearSearch}
              disabled={!searchTerm}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Available Jobs</h5>
            <span className="badge bg-light text-dark">
              {filteredJobs.length} of {count} jobs
            </span>
          </div>
          <div className="card-body p-0">
            {filteredJobs.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map(job => (
                      <tr key={job.id}>
                        <td>
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none fw-bold">
                            {job.title}
                          </Link>
                        </td>
                        <td>{job.Company?.name || 'Unknown'}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td>{job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}</td>
                        <td>
                          <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-primary">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <h5>No jobs found</h5>
                <p className="text-muted">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No jobs are currently available'}
                </p>
                {searchTerm && (
                  <button 
                    className="btn btn-outline-primary mt-2"
                    onClick={handleClearSearch}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPublic;
