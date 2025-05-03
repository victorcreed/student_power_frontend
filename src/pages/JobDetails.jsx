import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById, clearSelectedJob } from '../store/slices/jobsSlice';

const JobNotFound = () => (
  <div className="card bg-warning-subtle border-warning">
    <div className="card-body text-center py-5">
      <h2 className="card-title">Job Not Found</h2>
      <p className="card-text mb-4">
        The job listing you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/jobs/public" className="btn btn-primary">
        Browse All Jobs
      </Link>
    </div>
  </div>
);

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { selectedJob, jobStatus, jobError } = useSelector(state => state.jobs || {});
  const job = selectedJob?.data;
  const isLoading = jobStatus === 'loading';
  
  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
    
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, id]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span>Loading job details...</span>
      </div>
    );
  }

  if (jobError || !job) {
    return <JobNotFound />;
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/jobs/public">Jobs</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{job.title}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">{job.title}</h2>
              <span className={`badge bg-${job.status?.toLowerCase() === 'active' ? 'success' : 'secondary'}`}>
                {job.status}
              </span>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h4>Job Description</h4>
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            </div>
            <div className="card-footer bg-white">
              <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline-secondary"
                type="button"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Job Details</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Company:</strong>
                  <span>{job.Company?.name || 'Not specified'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Status:</strong>
                  <span className={`badge ${job.status?.toLowerCase() === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {job.status}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Applications:</strong>
                  <span>{job.applicationCount || 0}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Approval Status:</strong>
                  <span>
                    {job.isApproved 
                      ? <span className="text-success">Approved</span> 
                      : <span className="text-warning">Pending</span>}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Posted On:</strong>
                  <span>{formatDate(job.createdAt)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Application Deadline:</strong>
                  <span>{formatDate(job.expiresAt)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Last Updated:</strong>
                  <span>{formatDate(job.updatedAt)}</span>
                </li>
              </ul>
            </div>
          </div>

          {job.Company && (
            <div className="card">
              <div className="card-header">
                <h4>About the Company</h4>
              </div>
              <div className="card-body">
                <h5>{job.Company.name}</h5>
                <p className="mb-0">Company ID: {job.companyId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
