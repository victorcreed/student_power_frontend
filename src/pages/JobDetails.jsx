import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import Button from '../components/common/Button';
import { useSelector } from 'react-redux';

const withJobData = Component => {
  return props => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, userData } = useSelector(state => state.auth);

    useEffect(() => {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const response = await jobService.getJobById(id);
          if (response && response.data) {
            setJob(response.data);
          } else {
            throw new Error('Job not found');
          }
        } catch (err) {
          setError('Failed to load job details. Please try again.');
          console.error('Error fetching job:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }, [id]);

    const handleApply = () => {
      if (!isAuthenticated) {
        navigate('/signin?redirect=' + encodeURIComponent(`/jobs/${id}`));
        return;
      }
      
      navigate(`/dashboard/applications/apply/${id}`);
    };

    return <Component 
      {...props}
      job={job}
      loading={loading}
      error={error}
      onApply={handleApply}
      isAuthenticated={isAuthenticated}
      userData={userData}
    />;
  };
};

const JobDetailsDisplay = ({ job, loading, error, onApply, isAuthenticated, userData }) => {
  if (loading) {
    return <div className="text-center py-4">Loading job details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!job) {
    return <div className="alert alert-warning">Job not found</div>;
  }

  const isCompanyAdmin = userData?.user?.role === 'company_admin';
  const isSchoolAdmin = userData?.user?.role === 'school_admin';
  const isJobOwner = isCompanyAdmin && job.companyId === userData?.company?.id;
  const isRegularUser = userData?.user?.role === 'user';

  return (
    <div className="job-details container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="mb-0">{job.title}</h1>
          <span className={`badge ${job.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
            {job.status}
          </span>
        </div>
        <div className="card-body">
          <h2>Company: {job.Company?.name || 'Not specified'}</h2>
          
          <div className="mb-4">
            <div className="row my-3">
              <div className="col-md-6">
                <strong>Open Until:</strong> {new Date(job.createdAt).toLocaleDateString()}
              </div>
              <div className="col-md-6">
                <strong>Project deadline:</strong> {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}
              </div>
              <div className="col-md-6">
                <strong>Efforts: 4hours</strong> 
              </div>
              <div className="col-md-6">
                <strong>Benefits: Viru folk festival</strong>
              </div>
            </div>
            
            {job.applicationCount > 0 && (
              <div className="alert alert-info">
                Applications: {job.applicationCount}
              </div>
            )}
            
            {job.approvalCount > 0 && (
              <div className="alert alert-success">
                School Approvals: {job.approvalCount}
              </div>
            )}
          </div>
          
          <h5>Project Description</h5>
          <div className="job-description mb-4" dangerouslySetInnerHTML={{ __html: job.description }}></div>
          
          <div className="d-flex justify-content-between mt-4">
            <Link to="/jobs/public" className="btn btn-outline-secondary">
              Back to Jobs
            </Link>
            
            {isJobOwner ? (
              <div>
                <Link to={`/dashboard/applications/${job.id}`} className="btn btn-outline-primary me-2">
                  View Applications ({job.applicationCount || 0})
                </Link>
                <Link to={`/dashboard/jobs/edit/${job.id}`} className="btn btn-outline-secondary">
                  Edit Project
                </Link>
              </div>
            ) : isRegularUser ? (
              <Button variant="primary" onClick={onApply}>
                Apply Now
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetails = withJobData(JobDetailsDisplay);

export default JobDetails;
