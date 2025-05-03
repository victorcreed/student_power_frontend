import React, { useState } from 'react';
import Button from '../common/Button';
import FormField from '../common/FormField';

const CompanySignup = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    company: {
      name: '',
    },
    user: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [key, subKey] = name.split('.');
      setFormData({
        ...formData,
        [key]: {
          ...formData[key],
          [subKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.company.name) newErrors['company.name'] = 'Company name is required';
    if (!formData.user.name) newErrors['user.name'] = 'Name is required';
    if (!formData.user.email) newErrors['user.email'] = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.user.email)) newErrors['user.email'] = 'Email is invalid';
    if (!formData.user.password) newErrors['user.password'] = 'Password is required';
    if (formData.user.password !== formData.user.passwordConfirmation) {
      newErrors['user.passwordConfirmation'] = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        company: {
          name: formData.company.name,
        },
        user: {
          name: formData.user.name,
          email: formData.user.email,
          password: formData.user.password,
        },
      };
      
      onSubmit(submitData);
    }
  };
  
  return (
    <div>
      <h2 className="mb-4">Company Registration</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Company Name"
          type="text"
          id="companyName"
          name="company.name"
          value={formData.company.name}
          onChange={handleChange}
          error={errors['company.name']}
        />
        
        <FormField
          label="Your Name"
          type="text"
          id="userName"
          name="user.name"
          value={formData.user.name}
          onChange={handleChange}
          error={errors['user.name']}
        />
        
        <FormField
          label="Email"
          type="email"
          id="userEmail"
          name="user.email"
          value={formData.user.email}
          onChange={handleChange}
          error={errors['user.email']}
        />
        
        <FormField
          label="Password"
          type="password"
          id="userPassword"
          name="user.password"
          value={formData.user.password}
          onChange={handleChange}
          error={errors['user.password']}
        />
        
        <FormField
          label="Confirm Password"
          type="password"
          id="userPasswordConfirmation"
          name="user.passwordConfirmation"
          value={formData.user.passwordConfirmation}
          onChange={handleChange}
          error={errors['user.passwordConfirmation']}
        />
        
        <div className="mt-4">
          <Button type="submit" variant="primary" className="w-100">
            Register Company
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySignup;
