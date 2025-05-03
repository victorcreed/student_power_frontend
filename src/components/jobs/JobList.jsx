import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { useSelector } from 'react-redux';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import { useNavigate } from 'react-router-dom';

const withApplicationHandling = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.auth);
    
    const handleViewApplications = (jobId) => {
      navigate(`/dashboard/applications/${jobId}`);
    };
    
    return <Component {...props} onViewApplications={handleViewApplications} />;
  };
};

const withJobViewing = Component => {
  return props => {
    const navigate = useNavigate();
    
    const handleView = (jobId) => {
      navigate(`/jobs/${jobId}`);
    };
    
    return <Component {...props} onView={handleView} />;
  };
};

const withJobEditing = Component => {
  return props => {
    const navigate = useNavigate();
    
    const handleEdit = (jobId) => {
      navigate(`/dashboard/jobs/edit/${jobId}`);
    };
    
    return <Component {...props} onEdit={handleEdit} />;
  };
};

const JobListBase = ({ onEdit, onView, onViewApplications, showApprovals }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const fetchJobs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters = {};
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      const response = await jobService.getJobs({ 
        page,
        limit: 10,
        status: statusFilter 
      });
      
      if (response.success) {
        setJobs(response.data || []);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil((response.count || 0) / 10),
          totalItems: response.count || 0
        });
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchJobs(1);
  }, [statusFilter]);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
      } catch (err) {
        alert('Failed to delete job. Please try again.');
        console.error('Error deleting job:', err);
      }
    }
  };
  
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handlePageChange = (page) => {
    fetchJobs(page);
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading jobs...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
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
  
  return (
    <div className="job-list">
      <div className="d-flex justify-content-end mb-3">
        <div className="form-group" style={{ width: '200px' }}>
          <select 
            className="form-select" 
            value={statusFilter} 
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      {jobs.length === 0 ? (
        <div className="alert alert-info">
          No jobs found. Create your first job posting!
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  {showApprovals && <th>School Approvals</th>}
                  <th>Applications</th>
                  <th>Expires</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    {showApprovals && <td>{job.approvalCount || 0}</td>}
                    <td>{job.applicationCount || 0}</td>
                    <td>
                      {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => onView(job.id)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => onEdit(job.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-info" 
                          onClick={() => onViewApplications(job.id)}
                        >
                          Apps ({job.applicationCount || 0})
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
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
        </>
      )}
    </div>
  );
};

const JobList = withApplicationHandling(withJobViewing(withJobEditing(JobListBase)));

export default JobList;
