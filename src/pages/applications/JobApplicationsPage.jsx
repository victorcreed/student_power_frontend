import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobService } from '../../services/jobService';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';

const withApplicationData = Component => {
  return props => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData } = useSelector(state => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          const endpoint = userData?.role === 'company_admin' 
            ? `/jobs/${jobId}/applications`
            : `/jobs/${jobId}/applicants`;
          
          const response = await jobService.getJobApplications(endpoint, {
            page: currentPage,
            limit: 10
          });

          setApplications(response.data.applications || []);
          setJob(response.data.jobInfo || {});
          setPagination(response.data.pagination || {
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
            itemsPerPage: 10
          });
        } catch (err) {
          setError('Failed to load applications. Please try again.');
          console.error('Error fetching applications:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, [jobId, currentPage, userData?.role]);
    
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
    
    const handleStatusChange = async (applicationId, newStatus) => {
      try {
        await jobService.updateApplicationStatus(applicationId, newStatus);
        
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
      } catch (err) {
        alert('Failed to update application status. Please try again.');
        console.error('Error updating application status:', err);
      }
    };

    return <Component 
      {...props}
      applications={applications}
      job={job}
      loading={loading}
      error={error}
      userData={userData}
      pagination={pagination}
      onPageChange={handlePageChange}
      onStatusChange={handleStatusChange}
    />;
  };
};

const ApplicationsDisplay = ({ 
  applications, 
  job, 
  loading, 
  error, 
  userData, 
  pagination, 
  onPageChange, 
  onStatusChange 
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'applied':
        return 'bg-primary';
      case 'pending':
        return 'bg-warning';
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      case 'interviewing':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };
  
  return (
    <div className="container mt-4">
      <h1>Applications for {job?.title}</h1>
      <p>Total Applications: {pagination.totalItems || 0}</p>
      
      {applications.length === 0 ? (
        <div className="alert alert-info">
          No applications found for this job.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>School</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => (
                  <tr key={application.id}>
                    <td>
                      {application.student?.name || 'Anonymous'}
                      <br />
                      <small className="text-muted">{application.student?.email}</small>
                    </td>
                    <td>{application.student?.school || 'N/A'}</td>
                    <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => window.open(`/dashboard/applications/view/${application.id}`, '_blank')}
                        >
                          View
                        </Button>
                        
                        {userData?.role === 'company_admin' && (
                          <>
                            <Button 
                              variant="outline-success" 
                              onClick={() => onStatusChange(application.id, 'accepted')}
                              disabled={application.status === 'accepted'}
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outline-info" 
                              onClick={() => onStatusChange(application.id, 'interviewing')}
                              disabled={application.status === 'interviewing'}
                            >
                              Interview
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              onClick={() => onStatusChange(application.id, 'rejected')}
                              disabled={application.status === 'rejected'}
                            >
                              Reject
                            </Button>
                          </>
                        )}
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
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

const JobApplicationsPage = withApplicationData(ApplicationsDisplay);

export default JobApplicationsPage;
