import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import { useSelector } from 'react-redux';

const StudentJobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const { userData } = useSelector(state => state.auth);
  const [applications, setApplications] = useState([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);

  const fetchJobs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await jobService.getJobs({ 
        page,
        limit: 10,
        status: 'active',
        schoolId: userData?.school?.id
      });
      setJobs(response.data.jobs || []);
      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0
      });
    } catch (err) {
      setError('Failed to load approved jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchApplications = async () => {
    if (applicationsLoaded || !userData?.user?.id) return;
    
    try {
      const response = await jobService.getStudentApplications();
      if (response.data.applications) {
        setApplications(response.data.applications);
        
        // Mark which jobs user has already applied to
        const appliedJobIds = response.data.applications.map(app => app.job.id);
        setJobs(prevJobs => 
          prevJobs.map(job => ({
            ...job,
            hasApplied: appliedJobIds.includes(job.id)
          }))
        );
      }
      setApplicationsLoaded(true);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    fetchApplications();
  }, [userData]);
  
  const handlePageChange = (page) => {
    fetchJobs(page);
  };
  
  const handleApply = async (jobId) => {
    try {
      setIsApplying(true);
      setSelectedJob(jobId);
      
      // Can include cover letter or resume if API supports it
      const payload = {
        coverLetter: ''
      };
      
      await jobService.applyToJob(jobId, payload);
      setApplicationSuccess(true);
      
      // Update job status locally
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, hasApplied: true }
          : job
      ));
      
      // Refresh applications list
      fetchApplications();
      
      setTimeout(() => {
        setApplicationSuccess(false);
        setSelectedJob(null);
      }, 3000);
    } catch (err) {
      console.error('Error applying to job:', err);
      alert(err.response?.data?.error || 'Failed to apply for job. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'expired': return 'bg-warning';
      case 'draft': return 'bg-info';
      case 'closed': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };
  
  if (isLoading && jobs.length === 0) {
    return <div className="text-center py-4">Loading approved jobs...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  return (
    <div className="student-job-listing">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Jobs</h2>
      </div>
      
      {applicationSuccess && (
        <div className="alert alert-success">
          Successfully applied for the job!
        </div>
      )}
      
      {jobs.length === 0 ? (
        <div className="alert alert-info">No approved jobs available at this time.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company?.name || 'Unknown'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                        >
                          View
                        </Button>
                        {!job.isApplied ? (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleApply(job.id)}
                            disabled={isApplying && selectedJob === job.id}
                          >
                            {isApplying && selectedJob === job.id ? 'Applying...' : 'Apply'}
                          </Button>
                        ) : (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            disabled
                          >
                            Applied
                          </Button>
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
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default StudentJobListing;
