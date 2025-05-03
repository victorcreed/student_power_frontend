import React from 'react';
import { getEnvVariable } from '../utils/environmentUtils';

export const withEnvironment = (WrappedComponent) => {
  return (props) => {
    const envProps = {
      apiBaseUrl: getEnvVariable('VITE_API_BASE_URL'),
      environment: getEnvVariable('VITE_APP_ENVIRONMENT') || import.meta.env.MODE
    };
    
    return <WrappedComponent {...props} env={envProps} />;
  };
};
