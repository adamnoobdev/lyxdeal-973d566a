
import { useCustomers, exportCustomersToCSV } from './customers/useCustomers';
import { CustomerTableSkeleton } from './customers/CustomerTableSkeleton';
import { EmptyCustomersList } from './customers/EmptyCustomersList';
import { CustomersTableHeader } from './customers/CustomersTableHeader';
import { CustomersTableContent } from './customers/CustomersTableContent';

export function CustomersTable() {
  const { customers, isLoading } = useCustomers();

  const handleExportToCSV = () => {
    if (customers) {
      exportCustomersToCSV(customers);
    }
  };

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
}
