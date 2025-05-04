import React, { useState } from 'react';

const withFormHandling = (initialState) => (WrappedComponent) => {
  return (props) => {
    const [formData, setFormData] = useState(initialState);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const resetForm = () => {
      setFormData(initialState);
    };
    
    const formProps = {
      formData,
      setFormData,
      handleChange,
      resetForm
    };
    
    return <WrappedComponent {...props} {...formProps} />;
  };
};

export default withFormHandling;
