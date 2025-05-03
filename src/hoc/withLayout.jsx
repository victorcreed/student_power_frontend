import React from 'react';

const withLayout = (Component) => {
  return (props) => {
    return (
      <div className="page-container">
        <Component {...props} />
      </div>
    );
  };
};

export default withLayout;
