export const getEnvVariable = (key, defaultValue = '') => {
  if (window.env && window.env[key]) {
    return window.env[key];
  }
  
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  return defaultValue;
};

export const isProduction = () => {
  return import.meta.env.PROD || getEnvVariable('VITE_APP_ENVIRONMENT') === 'production';
};

export const isDevelopment = () => {
  return import.meta.env.DEV || getEnvVariable('VITE_APP_ENVIRONMENT') === 'development';
};
