import React from 'react';

const withDashboard = (WrappedComponent) => {
  return function WithDashboardComponent(props) {
    return (
      <div className="dashboard-container py-4">
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withDashboard;
