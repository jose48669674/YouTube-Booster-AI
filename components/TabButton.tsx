import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        isActive
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
      } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

export default TabButton;
