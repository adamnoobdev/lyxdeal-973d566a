
import React from 'react';
import { Helmet } from 'react-helmet';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { UsersManagement } from '@/components/admin/users/UsersManagement';

const AdminUsers = () => {
  return (
    <>
      <Helmet>
        <title>Användarhantering | Admin</title>
      </Helmet>
      <AdminLayout>
        <UsersManagement />
      </AdminLayout>
    </>
  );
};

export default AdminUsers;
