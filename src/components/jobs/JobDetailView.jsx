import React from 'react';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';

const JobDetailView = ({ jobDetail, onBack, getStatusBadgeClass }) => {
  return (
    <div className="student-dashboard job-detail-view">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Job Details</h2>
          <Button 
            variant="outline-secondary" 
            onClick={onBack}
          >
            Back to Jobs
          </Button>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">{jobDetail.title}</h3>
            <div className="mb-3">
              <StatusBadge status={jobDetail.status} />
            </div>
            
            <div className="mb-3">
              <strong>Company:</strong> {jobDetail.company?.name || 'Unknown'}
            </div>
            
            <div className="mb-3">
              <strong>Posted:</strong> {new Date(jobDetail.createdAt).toLocaleDateString()}
              {jobDetail.expiresAt && (
                <div><strong>Expires:</strong> {new Date(jobDetail.expiresAt).toLocaleDateString()}</div>
              )}
            </div>
            
            <div className="mb-4">
              <h5>Description</h5>
              <div className="job-description" dangerouslySetInnerHTML={{ __html: jobDetail.description }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailView;
