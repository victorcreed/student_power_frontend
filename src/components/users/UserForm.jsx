import React, { useState } from 'react';
import { userService } from '../../services/userService';
import { useSelector } from 'react-redux';
import Button from '../common/Button';

const UserForm = ({ onSuccess }) => {
  const { userData } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const response = await userService.createUser(formData);
      
      setSuccessMessage('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      if (onSuccess) {
        onSuccess(response.data.user);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create user. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determine which roles the current user can create
  const canCreateAdmin = userData?.user?.role === 'admin';
  const isSchoolAdmin = userData?.user?.role === 'school_admin';
  const isCompanyAdmin = userData?.user?.role === 'company_admin';
  
  const getRoleOptions = () => {
    if (canCreateAdmin) {
      return (
        <>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="school_admin">School Admin</option>
          <option value="company_admin">Company Admin</option>
        </>
      );
    } else if (isSchoolAdmin) {
      return (
        <>
          <option value="user">User</option>
          <option value="school_admin">School Admin</option>
        </>
      );
    } else if (isCompanyAdmin) {
      return (
        <>
          <option value="company_admin">Company Admin</option>
        </>
      );
    } else {
      return <option value="user">User</option>;
    }
  };

  return (
    <div className="user-form card">
      <div className="card-body">
        <h3 className="card-title">Add New User</h3>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {getRoleOptions()}
            </select>
          </div>
          
          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
