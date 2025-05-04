import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../components/common/Button';
import withLayout from '../hoc/withLayout';
import withFormHandling from '../hoc/withFormHandling';
import { clearError, verifyUser } from '../store/slices/authSlice';
import AlertMessage from '../components/common/AlertMessage';
import { authService } from '../services/api';

const SignIn = ({ formData, handleChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    setIsLoading(true);
    
    try {
      const response = await authService.signIn(formData);
      
      let userType = null;
      if (response.data.data?.user?.role === 'school_admin') {
        userType = 'school';
      } else if (response.data.data?.user?.role === 'company_admin') {
        userType = 'company';
      } else if (response.data.data?.school) {
        userType = 'school';
      } else if (response.data.data?.company) {
        userType = 'company';
      } else {
        userType = 'school';
      }
      
      setAlert({
        type: 'success',
        message: 'Login successful! Redirecting...'
      });
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_type', userType);
      localStorage.setItem('user_data', JSON.stringify(response.data.data));
      
      const verifyResult = await dispatch(verifyUser()).unwrap();
      if (verifyResult) {
        const redirectPath = userType === 'school' ? '/school/dashboard' : '/company/dashboard';
        navigate(redirectPath, { replace: true });
      }
      
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || errorData?.message || 'Authentication failed';
      
      setAlert({
        type: 'danger',
        message: errorMessage
      });
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow">
            <div className="card-body p-4 p-lg-5">
              <h2 className="text-center mb-4">Sign In</h2>
              
              {alert.message && <AlertMessage type={alert.type} message={alert.message} />}
              
              <form onSubmit={handleSubmit}>
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
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p>Don't have an account? <a href="/signup" className="text-decoration-none">Create one</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(
  withFormHandling({ email: '', password: '' })(SignIn)
);
