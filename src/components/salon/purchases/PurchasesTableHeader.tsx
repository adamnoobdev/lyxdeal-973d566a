
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PurchasesTableHeaderProps {
  onExport: () => void;
}

export const PurchasesTableHeader = ({ onExport }: PurchasesTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Rabattkodshistorik</h2>
        <p className="text-muted-foreground">
          Här visas alla rabattkoder som hämtats för dina erbjudanden.
        </p>
      </div>
      <Button 
        onClick={onExport} 
        className="gap-2 bg-primary text-white hover:bg-primary/90"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Exportera CSV</span>
      </Button>
    </div>
  );
};
