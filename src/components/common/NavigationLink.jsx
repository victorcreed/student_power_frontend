import { NavLink, NavLinkProps } from 'react-router-dom';
import React from 'react';

interface CustomNavLinkProps extends Omit<NavLinkProps, 'className'> {
  className?: string | ((props: { isActive: boolean }) => string);
}

// This is a HOC that wraps react-router's NavLink to provide consistent styling
const NavigationLink: React.FC<CustomNavLinkProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  // Default styling function that can be overridden by passing a className function
  const defaultClassNameFn = ({ isActive }: { isActive: boolean }) => {
    return `transition-colors ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`;
  };

  return (
    <NavLink
      {...props}
      className={typeof className === 'function' 
        ? className 
        : (navData) => {
            const defaultClasses = defaultClassNameFn(navData);
            return className ? `${defaultClasses} ${className}` : defaultClasses;
          }
      }
    >
      {children}
    </NavLink>
  );
};

export default NavigationLink;
