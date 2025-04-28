
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { CreatorsList } from '@/components/admin/creators/CreatorsList';

const AdminCreators = () => {
  return (
    <AdminAuthCheck>
      <AdminLayout>
        <div className="container mx-auto p-4 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Kreatörer</h1>
          <CreatorsList />
        </div>
      </AdminLayout>
    </AdminAuthCheck>
  );
};

export default AdminCreators;
