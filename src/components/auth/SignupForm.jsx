import React from 'react';
import { Link } from 'react-router-dom';

const withSignupForm = (SpecificFields, userType) => {
  return function SignupForm({ onSubmit }) {
    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      confirmPassword: '',
    });
    
    const [errors, setErrors] = React.useState({});

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      return newErrors;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = validateForm();
      
      if (Object.keys(newErrors).length === 0) {
        onSubmit({ ...formData, userType });
      } else {
        setErrors(newErrors);
      }
    };

    return (
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">{userType} Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            {SpecificFields && 
              <SpecificFields 
                formData={formData} 
                setFormData={setFormData} 
                errors={errors}
                setErrors={setErrors}
              />
            }
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            
            <button type="submit" className="btn btn-primary w-100 mt-3">Sign Up</button>
          </form>
          
          <div className="mt-3 text-center">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
};

export default withSignupForm;
