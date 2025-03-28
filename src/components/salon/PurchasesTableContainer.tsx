
import { usePurchases, exportPurchasesToCSV } from './purchases/usePurchases';
import { PurchasesTable } from './PurchasesTable';
import { PurchasesTableHeader } from './purchases/PurchasesTableHeader';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function PurchasesTableContainer() {
  const { purchases, isLoading, error } = usePurchases();

  const handleExportToCSV = () => {
    if (purchases) {
      exportPurchasesToCSV(purchases);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Det gick inte att hämta rabattkodshistorik: {error.message}
          </AlertDescription>
        </Alert>
      )}
      
      <PurchasesTableHeader onExport={handleExportToCSV} />
      <PurchasesTable purchases={purchases || []} isLoading={isLoading} />
    </div>
  );
}
