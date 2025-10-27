import React from 'react';
import { Youtube } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
        <Youtube className="w-10 h-10 text-red-500" />
        <h1 className="text-3xl font-bold text-white tracking-tight">
          YouTube Booster <span className="text-blue-500">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
