import React from 'react';
import withDashboard from '../hoc/withDashboard';
import StatsCard from '../common/StatsCard';

const SchoolDashboard = ({ schoolData }) => {
  const { name, email, students = 0, jobs = 0 } = schoolData || {};
  
  return (
    <div className="container">
      <h1>School Dashboard</h1>
      
      <div className="dashboard-tabs mb-4">
        <div className="nav nav-tabs">
          <div className="nav-item">
            <button className="nav-link active">Overview</button>
          </div>
          <div className="nav-item">
            <button className="nav-link">Jobs</button>
          </div>
          <div className="nav-item">
            <button className="nav-link">Users</button>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="text-center">School Profile</h3>
              <div className="mt-3">
                <p><strong>Name:</strong> {name || 'school 5'}</p>
                <p><strong>Email:</strong> {email || 'a2ninek+school@gmail.com'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="text-center">Quick Stats</h3>
              <div className="d-flex justify-content-around mt-4">
                <StatsCard value={students} label="Students" />
                <StatsCard value={jobs} label="Jobs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDashboard(SchoolDashboard);
