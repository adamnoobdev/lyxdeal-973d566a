
import { usePurchases, exportPurchasesToCSV } from './purchases/usePurchases';
import { PurchasesTable } from './PurchasesTable';
import { PurchasesTableHeader } from './purchases/PurchasesTableHeader';

export function PurchasesTableContainer() {
  const { purchases, isLoading } = usePurchases();

  const handleExportToCSV = () => {
    if (purchases) {
      exportPurchasesToCSV(purchases);
    }
  };

  return (
    <div className="space-y-4">
      <PurchasesTableHeader onExport={handleExportToCSV} />
      <PurchasesTable purchases={purchases || []} isLoading={isLoading} />
    </div>
  );
}
