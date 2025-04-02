
import { useCustomers, exportCustomersToCSV } from './customers/useCustomers';
import { CustomerTableSkeleton } from './customers/CustomerTableSkeleton';
import { EmptyCustomersList } from './customers/EmptyCustomersList';
import { CustomersTableHeader } from './customers/CustomersTableHeader';
import { CustomersTableContent } from './customers/CustomersTableContent';
import { SalonLayout } from './layout/SalonLayout';

export function CustomersTable() {
  const { customers, isLoading } = useCustomers();

  const handleExportToCSV = () => {
    if (customers) {
      exportCustomersToCSV(customers);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <CustomerTableSkeleton />;
    }

    if (!customers?.length) {
      return <EmptyCustomersList />;
    }

    return (
      <div className="space-y-4">
        <CustomersTableHeader onExport={handleExportToCSV} />
        <CustomersTableContent customers={customers} />
      </div>
    );
  };

  return (
    <SalonLayout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Kunder</h1>
        {renderContent()}
      </div>
    </SalonLayout>
  );
}
