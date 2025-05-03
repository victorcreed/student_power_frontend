import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SchoolSignup from '../components/auth/SchoolSignup';
import CompanySignup from '../components/auth/CompanySignup';
import Button from '../components/common/Button';
import withLayout from '../hoc/withLayout';
import { authService } from '../services/api';
import AlertMessage from '../components/common/AlertMessage';

const Signup = () => {
  const [userType, setUserType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setAlert({ type: '', message: '' });
    
    try {
      const response = await authService.signUp(formData);
      setAlert({
        type: 'success',
        message: 'Registration successful! Redirecting to homepage...'
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (error.response) {
        const { data } = error.response;
        
        if (data.error && Array.isArray(data.error)) {
          errorMessage = data.error[0];
        } else if (data.error && typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data.success === false && data.error) {
          errorMessage = Array.isArray(data.error) ? data.error[0] : data.error;
        } else if (data.errors) {
          if (data.errors.email) {
            errorMessage = 'This email is already in use.';
          } else if (userType === 'company' && data.errors.company?.name) {
            errorMessage = 'This company name is already registered.';
          } else if (userType === 'school' && data.errors.school?.name) {
            errorMessage = 'This school name is already registered.';
          }
        }
      }
      
      setAlert({
        type: 'danger',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!userType) {
    return (
      <div className="container auth-container">
        <div className="account-type-container">
          <div className="account-type-heading">
            <h2 className="mb-3">Choose Account Type</h2>
            <p className="text-muted mb-4">
              Select the type of account you want to create
            </p>
          </div>
          
          <div className="d-grid gap-3 mt-4">
            <Button 
              variant="outline" 
              className="btn-account"
              onClick={() => setUserType('school')}
            >
              School
            </Button>
            
            <Button 
              variant="outline" 
              className="btn-account"
              onClick={() => setUserType('company')}
            >
              Company
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8 col-xl-6">
          {alert.message && <AlertMessage type={alert.type} message={alert.message} />}
          
          {userType === 'school' ? (
            <SchoolSignup onSubmit={handleSubmit} />
          ) : (
            <CompanySignup onSubmit={handleSubmit} />
          )}
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-decoration-none" 
              onClick={() => setUserType('')}
              disabled={isSubmitting}
            >
              Go back to account type selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(Signup);
