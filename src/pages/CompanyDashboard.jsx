import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withLayout from '../hoc/withLayout';
import UserManagement from '../components/users/UserManagement';
import JobManagement from '../components/jobs/JobManagement';
import { fetchPublicJobs } from '../store/slices/jobsSlice';
import { jobService } from '../services/jobService';

const CompanyDashboard = () => {
  const { userData } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  
  const selectJobsState = state =>
    state.jobs ||
    state.jobsSlice ||
    (state.slices && state.slices.jobs) ||
    {};
    
  const { jobs = [], status, error } = useSelector(selectJobsState);
  
  const [companyData, setCompanyData] = useState({
    name: userData?.company?.name || '',
    email: userData?.user?.email || '',
    companyId: userData?.company?.id || '',
    applications: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        
        setCompanyData(prev => ({
          ...prev,
          name: userData?.company?.name || prev.name,
          email: userData?.user?.email || prev.email,
          companyId: userData?.company?.id || prev.companyId
        }));
        
        if (userData?.company?.id) {
          dispatch(fetchPublicJobs());
          
          try {
            const appResult = await jobService.getApplications();
            if (appResult.success) {
              setCompanyData(prev => ({
                ...prev,
                applications: appResult.data.data.map(app => ({
                  id: app.id,
                  student: app.User.name || 'Student',
                  position: app.jobTitle || 'Position',
                  status: app.status || 'Pending'
                })).slice(0, 5)
              }));
            }
          } catch (error) {
            console.error('Error fetching application data:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch company data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [userData, dispatch]);

  const isLoadingJobs = status === 'loading';
  
  if (isLoading || isLoadingJobs) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  const companyJobs = jobs.filter(job => job.companyId === userData?.company?.id);
  const opportunities = companyJobs.map(job => ({
    id: job.id,
    title: job.title,
    status: job.status,
    expiresAt: job.expiresAt,
    applicants: job.applicationCount || 0,
    isApproved: job.isApproved
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'overview':
      default:
        return (
          <div className="company-dashboard-overview">
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Company Profile</h5>
                    <p className="card-text">
                      <strong>Name:</strong> {companyData.name}<br />
                      <strong>Email:</strong> {companyData.email}<br />
                      <strong>Total Projects:</strong> {opportunities.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Quick Stats</h5>
                    <div className="row">
                      <div className="col-6">
                        <div className="stat-box p-3 bg-light rounded">
                          <h3>{opportunities.length}</h3>
                          <p className="mb-0">Open Positions</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="stat-box p-3 bg-light rounded">
                          <h3>{opportunities.reduce((sum, opp) => sum + opp.applicants, 0)}</h3>
                          <p className="mb-0">Total Applicants</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    Active Projects
                  </div>
                  <div className="card-body">
                    {opportunities.length > 0 ? (
                      <ul className="list-group">
                        {opportunities.map(opportunity => (
                          <li key={opportunity.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              {opportunity.title}
                              <span className={`ms-2 badge ${opportunity.isApproved ? 'bg-success' : 'bg-warning'}`}>
                                {opportunity.isApproved ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                            <span className="badge bg-primary rounded-pill">{opportunity.applicants} applicants</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-3">No active opportunities. <button className="btn btn-sm btn-primary" onClick={() => setActiveTab('jobs')}>Create one</button></p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    Recent Applications
                  </div>
                  <div className="card-body">
                    {companyData.applications.length > 0 ? (
                      <ul className="list-group">
                        {companyData.applications.map(application => (
                          <li key={application.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{application.student}</strong>
                              <br />
                              <small className="text-muted">{application.position}</small>
                            </div>
                            <span className={`badge ${application.status === 'Interview' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                              {application.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-3">No recent applications</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="company-dashboard">
      <div className="container">
        <h2 className="mb-4">Company Dashboard</h2>
        
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
              Projects
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </li>
        </ul>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default withLayout(CompanyDashboard);
