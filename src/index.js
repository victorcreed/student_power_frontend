import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

if (typeof window !== 'undefined' && !window.process) {
  window.process = { env: {} };
  
  if (window.env) {
    Object.keys(window.env).forEach(key => {
      window.process.env[key] = window.env[key];
    });
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);