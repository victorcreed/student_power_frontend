import React, { useState } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { useSelector } from 'react-redux';

const UserManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { userData } = useSelector(state => state.auth);
  
  const handleUserAdded = () => {
    setShowAddForm(false);
    setRefreshKey(prev => prev + 1);
  };
  
  const userRole = userData?.user?.role;
  const isAdmin = userRole === 'admin' || userRole === 'school_admin' || userRole === 'company_admin';
  
  if (!isAdmin) {
    return <div className="alert alert-warning">You don't have permission to manage users.</div>;
  }
  
  return (
    <div className="user-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-4">
          <UserForm onSuccess={handleUserAdded} />
        </div>
      )}
      
      <UserList key={refreshKey} />
    </div>
  );
};

export default UserManagement;
