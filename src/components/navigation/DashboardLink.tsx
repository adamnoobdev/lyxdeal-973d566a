
import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardLinkProps {
  hasDashboard: boolean;
  dashboardPath: string;
  userRole?: string | null;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({
  hasDashboard,
  dashboardPath,
  userRole
}) => {
  if (!hasDashboard) return null;
  
  return (
    <Link 
      to={dashboardPath} 
      className="hidden md:inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80"
    >
      {userRole === 'admin' ? 'Admin' : 'Salong'}
    </Link>
  );
};

export default DashboardLink;
