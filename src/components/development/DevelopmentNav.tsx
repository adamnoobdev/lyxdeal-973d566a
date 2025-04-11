
import React from 'react';
import { useEnvironmentDetection } from '@/hooks/auth/useEnvironmentDetection';
import { Link } from 'react-router-dom';

export const DevelopmentNav: React.FC = () => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  if (!isSandboxEnvironment()) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 bg-opacity-80 text-white p-2 rounded-md shadow-lg z-50 text-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <Link to="/dev-admin" className="hover:underline">
          Dev Mode
        </Link>
      </div>
    </div>
  );
};
