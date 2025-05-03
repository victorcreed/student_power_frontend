import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import withLayout from '../hoc/withLayout';
import UserManagement from '../components/users/UserManagement';
import JobManagement from '../components/jobs/JobManagement';

const CompanyDashboard = () => {
  const { userData } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [companyData, setCompanyData] = useState({
    name: userData?.company?.name || '',
    email: userData?.user?.email || '',
    opportunities: [],
    applications: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch additional data from your API here
        
        // Update with user data from Redux store
        setCompanyData(prev => ({
          ...prev,
          name: userData?.company?.name || prev.name,
          email: userData?.user?.email || prev.email
        }));
      } catch (error) {
        console.error('Failed to fetch company data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [userData]);

  if (isLoading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

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
                      <strong>Email:</strong> {companyData.email}
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
                          <h3>{companyData.opportunities.length}</h3>
                          <p className="mb-0">Open Positions</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="stat-box p-3 bg-light rounded">
                          <h3>{companyData.opportunities.reduce((sum, opp) => sum + opp.applicants, 0)}</h3>
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
                    Active Opportunities
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {companyData.opportunities.map(opportunity => (
                        <li key={opportunity.id} className="list-group-item d-flex justify-content-between align-items-center">
                          {opportunity.title}
                          <span className="badge bg-primary rounded-pill">{opportunity.applicants} applicants</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    Recent Applications
                  </div>
                  <div className="card-body">
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
              Jobs
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
