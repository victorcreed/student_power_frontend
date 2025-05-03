import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = 'btn py-3 rounded-pill';
  const variantClass = variant === 'outline' ? 'btn-outline-primary' : `btn-${variant}`;
  
  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
