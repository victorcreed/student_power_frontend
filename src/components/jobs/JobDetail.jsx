import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Button from '../common/Button';

const JobDetail = ({ jobId, onEdit, onBack, readOnly = false }) => {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await jobService.getJob(jobId);
        setJob(response.data.job);
      } catch (err) {
        setError('Failed to load job details. Please try again.');
        console.error('Error fetching job:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(jobId);
        if (onBack) {
          onBack();
        }
      } catch (err) {
        alert('Failed to delete job. Please try again.');
        console.error('Error deleting job:', err);
      }
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'expired':
        return 'bg-warning';
      case 'closed':
        return 'bg-secondary';
      case 'draft':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading job details...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  if (!job) {
    return <div className="alert alert-info">Job not found.</div>;
  }
  
  return (
    <div className="job-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={onBack}
        >
          &larr; Back to Jobs
        </button>
        
        {!readOnly && (
          <div>
            <Button 
              variant="outline-primary" 
              className="me-2" 
              onClick={() => onEdit(jobId)}
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="card-title">{job.title}</h2>
            <span className={`badge ${getStatusBadgeClass(job.status)}`}>
              {job.status}
            </span>
          </div>
          
          <div className="mb-3">
            <strong>Company:</strong> {job.company?.name}
          </div>
          
          <div className="mb-3">
            {job.expiresAt ? (
              <div><strong>Expires:</strong> {new Date(job.expiresAt).toLocaleDateString()}</div>
            ) : (
              <div><strong>Expires:</strong> No expiration date</div>
            )}
            <div><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</div>
          </div>
          
          <h5>Description</h5>
          <div 
            className="job-description mb-4"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
