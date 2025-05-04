import React, { useState } from 'react';
import JobList from './JobList';
import JobForm from './JobForm';
import JobDetail from './JobDetail';
import JobApproval from './JobApproval';
import JobApplicationList from './JobApplicationList';
import { useSelector } from 'react-redux';

const JobManagement = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { userData } = useSelector(state => state.auth);
  
  const isSchoolAdmin = userData?.user?.role === 'school_admin';
  const isCompanyAdmin = userData?.user?.role === 'company_admin';
  
  const handleJobAdded = () => {
    setCurrentView('list');
    setRefreshKey(prev => prev + 1);
  };
  
  const handleEditJob = (id) => {
    setSelectedJobId(id);
    setCurrentView('edit');
  };
  
  const handleViewJob = (id) => {
    setSelectedJobId(id);
    setCurrentView('view');
  };
  
  const handleViewApplications = (id) => {
    setSelectedJobId(id);
    setCurrentView('applications');
  };
  
  const handleBack = () => {
    setCurrentView('list');
    setSelectedJobId(null);
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="job-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Project Management</h2>
        {currentView === 'list' && (
          <div className="d-flex gap-2">
            {isCompanyAdmin && (
              <button 
                className="btn btn-primary" 
                onClick={() => setCurrentView('create')}
              >
                Create New Project
              </button>
            )}
            {isSchoolAdmin && (
              <button 
                className="btn btn-outline-primary" 
                onClick={() => setCurrentView('approvals')}
              >
                Approve Jobs
              </button>
            )}
          </div>
        )}
      </div>
      
      {currentView === 'list' && (
        <JobList 
          key={refreshKey}
          onEdit={handleEditJob}
          onView={handleViewJob}
          onViewApplications={handleViewApplications}
          showApprovals={isCompanyAdmin}
        />
      )}
      
      {currentView === 'create' && (
        <JobForm onSuccess={handleJobAdded} />
      )}
      
      {currentView === 'edit' && (
        <JobForm 
          jobId={selectedJobId}
          onSuccess={handleJobAdded}
        />
      )}
      
      {currentView === 'view' && (
        <JobDetail 
          jobId={selectedJobId}
          onEdit={isCompanyAdmin ? handleEditJob : null}
          onBack={handleBack}
        />
      )}
      
      {currentView === 'approvals' && (
        <JobApproval onBack={handleBack} />
      )}
      
      {currentView === 'applications' && (
        <JobApplicationList 
          jobId={selectedJobId}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default JobManagement;
