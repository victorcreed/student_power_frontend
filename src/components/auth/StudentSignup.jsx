import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import api from '../../services/api';

const StudentSignup = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    schoolId: '',
    premium: false
  });
  
  const [errors, setErrors] = useState({});
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const response = await api.get('/schools');
        
        setSchools(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const setPlanType = (isPremium) => {
    setFormData({
      ...formData,
      premium: isPremium
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        premium: formData.premium
      };
      
      if (formData.schoolId) {
        submitData.schoolId = formData.schoolId;
      }
      
      onSubmit({user: submitData});
    }
  };

  return (
    <div>
      <h2 className="mb-4">Student Registration</h2>
      
      {!formData.premium ? (
        <div className="package-selection mb-4">
          <h4 className="mb-3">Choose Your Package:</h4>
          <div className="row">
            <div className={`col-md-6 mb-3 mb-md-0`}>
              <div className={`card h-100 ${!formData.premium ? 'border-primary' : ''}`}>
                <div className="card-header bg-light">
                  <h5 className="mb-0">Standard</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Basic Profile</li>
                    <li className="mb-2">✓ Job Applications</li>
                    <li className="mb-2">✓ Limited Resources</li>
                  </ul>
                  <Button 
                    type="button" 
                    variant={!formData.premium ? "primary" : "outline-primary"} 
                    className="w-100 mt-3"
                    onClick={() => setPlanType(false)}
                  >
                    {!formData.premium ? 'Selected' : 'Select Standard'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`card h-100 ${formData.premium ? 'border-primary' : ''}`}>
                <div className="card-header bg-light">
                  <h5 className="mb-0">Premium</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Enhanced Profile</li>
                    <li className="mb-2">✓ Priority Applications</li>
                    <li className="mb-2">✓ Unlimited Resources</li>
                    <li className="mb-2">✓ Career Coaching</li>
                  </ul>
                  <Button 
                    type="button" 
                    variant={formData.premium ? "primary" : "outline-primary"} 
                    className="w-100 mt-3"
                    onClick={() => setPlanType(true)}
                  >
                    {formData.premium ? 'Selected' : 'Select Premium'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="package-selected mb-4">
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>
              <strong>Premium Package Selected</strong> - Enjoy all premium benefits!
            </div>
            <Button 
              type="button" 
              variant="link" 
              className="text-decoration-none p-0" 
              onClick={() => setPlanType(false)}
            >
              Change
            </Button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormField
          label="Your Name"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        
        <FormField
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        
        <div className="mb-3">
          <label htmlFor="schoolId" className="form-label">Select Your School</label>
          <select
            className={`form-select ${errors.schoolId ? 'is-invalid' : ''}`}
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
          >
            <option value="">-- Select School (Optional) --</option>
            {loading ? (
              <option disabled>Loading schools...</option>
            ) : (
              schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))
            )}
          </select>
          {errors.schoolId && <div className="invalid-feedback">{errors.schoolId}</div>}
        </div>
        
        <FormField
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        
        <FormField
          label="Confirm Password"
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          value={formData.passwordConfirmation}
          onChange={handleChange}
          error={errors.passwordConfirmation}
        />
        
        <div className="mt-4">
          <Button type="submit" variant="primary" className="w-100">
            Register as Student
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentSignup;
