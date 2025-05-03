import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Pagination from '../common/Pagination';
import Button from '../common/Button';

const JobApplicationList = ({ jobId, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const fetchApplications = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await jobService.getJobApplications(jobId, page, 10);
      
      setApplications(response.data.applications || []);
      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0
      });
    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, [jobId]);
  
  const handlePageChange = (page) => {
    fetchApplications(page);
  };
  
  if (isLoading && applications.length === 0) {
    return <div className="text-center py-4">Loading applications...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  return (
    <div className="job-applications">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Job Applications</h3>
        <Button 
          variant="outline-secondary" 
          onClick={onBack}
        >
          Back
        </Button>
      </div>
      
      {applications.length === 0 ? (
        <div className="alert alert-info">No applications received for this job yet.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>School</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>{app.student?.name || 'Unknown'}</td>
                    <td>{app.student?.email || 'N/A'}</td>
                    <td>{app.student?.school || 'N/A'}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => window.open(`/applications/${app.id}`, '_blank')}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default JobApplicationList;
