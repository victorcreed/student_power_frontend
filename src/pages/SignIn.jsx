import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/common/Button';
import withLayout from '../hoc/withLayout';
import { signIn, clearError } from '../store/slices/authSlice';
import AlertMessage from '../components/common/AlertMessage';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, userType } = useSelector(state => state.auth);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setAlert({
        type: 'danger',
        message: Array.isArray(error) ? error[0] : error
      });
    } else if (isAuthenticated) {
      setAlert({
        type: 'success',
        message: 'Login successful! Redirecting...'
      });
      
      setTimeout(() => {
        if (userType === 'school') {
          navigate('/school/dashboard', { replace: true });
        } else {
          navigate('/company/dashboard', { replace: true });
        }
      }, 500);
    }
  }, [error, isAuthenticated, userType, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    dispatch(signIn(formData));
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

export default withLayout(SignIn);
