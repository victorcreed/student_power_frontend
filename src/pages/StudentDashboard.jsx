import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import withLayout from '../hoc/withLayout';
import { jobService } from '../services/jobService';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import JobRow from '../components/jobs/JobRow';
import withJobActions from '../components/jobs/JobActionButtons';
import StatusBadge from '../components/jobs/StatusBadge';
import JobDetailView from '../components/jobs/JobDetailView';

const EnhancedJobRow = withJobActions(JobRow);

const StudentDashboard = () => {
  const { userData } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState({
    name: userData?.user?.name || '',
    email: userData?.user?.email || '',
    school: userData?.school?.name || '',
    applications: []
  });
  
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [viewingJobId, setViewingJobId] = useState(null);
  const [jobDetail, setJobDetail] = useState(null);
  const [jobDetailLoading, setJobDetailLoading] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        setStudentData(prev => ({
          ...prev,
          name: userData?.user?.name || prev.name,
          email: userData?.user?.email || prev.email,
          school: userData?.school?.name || prev.school
        }));
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [userData]);

  const fetchApprovedJobs = async (page = 1) => {
    
    try {
      setJobsLoading(true);
      setJobsError(null);
      
      let params = { 
        page,
        limit: 10,
        status: 'active',
        schoolId: userData?.school?.id
      }

      if (userData?.school?.id) {
        params = {
          ...params,
          schoolId: userData?.school?.id
        };
      }
      const response = await jobService.getJobs(params);
      
      setJobs(response.data || []);
      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0
      });
    } catch (err) {
      setJobsError('Failed to load approved jobs.');
      console.error('Error fetching jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchApprovedJobs(1);
    }
  }, [activeTab, userData?.school?.id]);
  
  const handlePageChange = (page) => {
    fetchApprovedJobs(page);
  };
  
  const handleApply = async (jobId) => {
    try {
      setIsApplying(true);
      setSelectedJob(jobId);
      await jobService.apply(jobId, {}); // Changed from applyToJob to apply
      setApplicationSuccess(true);
      
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, isApplied: true }
          : job
      ));
      
      setTimeout(() => {
        setApplicationSuccess(false);
        setSelectedJob(null);
      }, 3000);
    } catch (err) {
      alert('Failed to apply for job. Please try again.');
      console.error('Error applying to job:', err);
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

  const handleViewJob = async (jobId) => {
    try {
      setJobDetailLoading(true);
      setViewingJobId(jobId);
      setView('jobDetail');
      
      const response = await jobService.getJob(jobId);
      setJobDetail(response.data.job);
    } catch (err) {
      alert('Failed to load job details. Please try again.');
      console.error('Error loading job details:', err);
      setView('dashboard');
    } finally {
      setJobDetailLoading(false);
    }
  };
  
  const handleBackToJobs = () => {
    setView('dashboard');
    setViewingJobId(null);
    setJobDetail(null);
  };

  // Fetch student's job applications
  const fetchStudentApplications = async (page = 1) => {
    try {
      setJobsLoading(true);
      setJobsError(null);
      
      const response = await jobService.getApplications();
      if (response.data.data.applications) {
        setStudentData(prev => ({
          ...prev,
          applications: response.data.data.applications
        }));
      }
      
    } catch (err) {
      console.error('Error fetching student applications:', err);
    } finally {
      setJobsLoading(false);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'applications') {
      fetchStudentApplications(1);
    }
  }, [activeTab]);

  if (isLoading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  if (view === 'jobDetail') {
    return jobDetailLoading ? (
      <div className="text-center py-4">Loading job details...</div>
    ) : !jobDetail ? (
      <div className="alert alert-danger">Job not found or no longer available.</div>
    ) : (
      <JobDetailView 
        jobDetail={jobDetail}
        onBack={handleBackToJobs}
        getStatusBadgeClass={getStatusBadgeClass}
      />
    );
  }

  // Update the applications tab rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="student-jobs">
            {applicationSuccess && (
              <div className="alert alert-success">
                Successfully applied for the job!
              </div>
            )}
            
            {jobsLoading && jobs.length === 0 ? (
              <div className="text-center py-4">Loading approved jobs...</div>
            ) : jobsError ? (
              <div className="alert alert-danger">{jobsError}</div>
            ) : jobs.length === 0 ? (
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
                        <EnhancedJobRow
                          key={job.id}
                          job={job}
                          isApplying={isApplying}
                          selectedJob={selectedJob}
                          onApply={handleApply}
                          onView={handleViewJob}
                        />
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
      case 'applications':
        return (
          <div className="student-applications">
            {jobsLoading ? (
              <div className="text-center py-4">Loading your applications...</div>
            ) : studentData.applications.length === 0 ? (
              <div className="alert alert-info">You haven't applied to any jobs yet.</div>
            ) : (
              <>
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
                      {studentData.applications.map(application => (
                        <tr key={application.id}>
                          <td>{application.job?.title || 'Unknown Job'}</td>
                          <td>{application.job?.company || 'Unknown'}</td>
                          <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              application.status === 'pending' ? 'bg-warning' :
                              application.status === 'accepted' ? 'bg-success' :
                              application.status === 'rejected' ? 'bg-danger' :
                              'bg-secondary'
                            }`}>
                              {application.status || 'pending'}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewJob(application.job?.id)}
                            >
                              View Job
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="student-dashboard-overview">
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Student Profile</h5>
                    <p className="card-text">
                      <strong>Name:</strong> {studentData.name}<br />
                      <strong>Email:</strong> {studentData.email}<br />
                      <strong>School:</strong> {studentData.school}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Quick Links</h5>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab('jobs')}
                      >
                        Browse Available Jobs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="row mt-5">
              <div className="col-md-4 mb-4">
                <div className='card-body'>
                  <h5 className='card-text'>Completion Rate:</h5>
                  <h4 className="card-title">100%</h4>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className='card-body'>
                  <h5 className='card-text'>Rating:</h5>
                  <h4 className="card-title">4.6</h4>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className='card-body'>
                  <h5 className='card-text'>Current Project Progress:</h5>
                  <h4 className="card-title">65%</h4>
                </div>
              </div>
            </div>

          </div>
        );
    }
  };

  return (
    <div className="student-dashboard">
      <div className="container">
        <h2 className="mb-4">Student Dashboard</h2>
        
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Available Jobs
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              My Applications
            </button>
          </li>
        </ul>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default withLayout(StudentDashboard);
