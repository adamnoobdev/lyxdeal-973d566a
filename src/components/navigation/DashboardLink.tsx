
import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardLinkProps {
  hasDashboard: boolean;
  dashboardPath: string;
  userRole?: string | null;
  className?: string;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({
  hasDashboard,
  dashboardPath,
  userRole,
  className = ''
}) => {
  // Directly return null if hasDashboard is false
  if (!hasDashboard) return null;
  
  return (
    <Link 
      to={dashboardPath} 
      className={`text-sm font-medium text-gray-700 hover:text-primary transition-colors ${className}`}
    >
      {userRole === 'creator' ? 'Kreatörportal' : 'Dashboard'}
    </Link>
  );
};

export default DashboardLink;
