import React from 'react';

const AlertMessage = ({ type, message }) => {
  if (!message) return null;
  
  return (
    <div className={`alert alert-${type} mb-4`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
