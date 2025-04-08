
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
  if (!hasDashboard) return null;
  
  return (
    <Link to={dashboardPath} className={`text-sm font-medium ${className}`}>
      {userRole === 'admin' ? 'Admin' : 'Dashboard'}
    </Link>
  );
};

export default DashboardLink;
