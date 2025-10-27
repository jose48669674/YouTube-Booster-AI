import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ isLoading = false, children, icon, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? <Spinner /> : (icon && <span className="mr-2 -ml-1">{icon}</span>)}
      {children}
    </button>
  );
};

export default Button;
