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
  return;
};
export default DashboardLink;