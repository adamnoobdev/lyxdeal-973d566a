
import React from 'react';
import { Helmet } from 'react-helmet';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Dashboard | Lyxdeal</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p>Admin kontrollpanel kommer här.</p>
    </div>
  );
};

export default AdminDashboard;
