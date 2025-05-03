import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Button from '../common/Button';
import Pagination from '../common/Pagination';

const StudentApplications = () => {
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
      
      const response = await jobService.getStudentApplications(page, 10);
      
      setApplications(response.data.applications || []);
      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0
      });
    } catch (err) {
      setError('Failed to load your applications. Please try again.');
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, []);
  
  const handlePageChange = (page) => {
    fetchApplications(page);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'applied': return 'bg-primary';
      case 'pending': return 'bg-warning';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'interview': return 'bg-info';
      default: return 'bg-secondary';
    }
  };
  
  if (isLoading && applications.length === 0) {
    return <div className="text-center py-4">Loading your applications...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  if (applications.length === 0) {
    return <div className="alert alert-info">You haven't applied to any jobs yet.</div>;
  }
  
  return (
    <div className="student-applications">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Applications</h2>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.job?.title || 'Unknown Job'}</td>
                <td>{app.job?.company || app.job?.company?.name || 'Unknown'}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                    {app.status || 'applied'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => window.open(`/jobs/${app.job?.id}`, '_blank')}
                      className="rounded-circle"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      disabled
                      className="rounded-pill"
                    >
                      Applied
                    </Button>
                  </div>
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
    </div>
  );
};

export default StudentApplications;
