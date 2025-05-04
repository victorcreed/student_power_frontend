import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import withLayout from '../hoc/withLayout';
import UserManagement from '../components/users/UserManagement';
import SchoolJobManagement from '../components/jobs/SchoolJobManagement';

const SchoolDashboard = () => {
  const { userData } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [schoolData, setSchoolData] = useState({
    name: userData?.school?.name || '',
    email: userData?.user?.email || '',
    students: [],
    jobs: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setIsLoading(true);
        setSchoolData(prev => ({
          ...prev,
          name: userData?.school?.name || prev.name,
          email: userData?.user?.email || prev.email
        }));
      } catch (error) {
        console.error('Failed to fetch school data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolData();
  }, [userData]);

  if (isLoading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <SchoolJobManagement />;
      case 'overview':
      default:
        return (
          <div className="school-dashboard-overview">
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                  <div className="card-body">
                    <h5 className="card-title">School Profile</h5>
                    <p className="card-text">
                      <strong>Name:</strong> {schoolData.name}<br />
                      <strong>Email:</strong> {schoolData.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8 mb-4">
                <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                  <div className="card-body">
                    <h5 className="card-title">Quick Stats</h5>
                    <div className="row">
                      <div className="col-6">
                        <div className="stat-box bg-transparent p-3 rounded">
                          <h3>{schoolData.students.length}</h3>
                          <p className="mb-0">Students</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="stat-box bg-transparent p-3 rounded">
                          <h3>{schoolData.jobs.length}</h3>
                          <p className="mb-0">Projects</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="school-dashboard">
      <div className="container">
        <h2 className="mb-4">School Dashboard</h2>
        
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} 
              className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Projects
            </button>
          </li>
          <li className="nav-item">
            <button
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} 
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

export default withLayout(SchoolDashboard);
