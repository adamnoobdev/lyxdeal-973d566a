
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PurchasesTableHeaderProps {
  onExport: () => void;
}

export const PurchasesTableHeader = ({ onExport }: PurchasesTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Köphistorik</h3>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExport}
        className="text-xs"
      >
        <Download className="h-3 w-3 mr-1" />
        Exportera
      </Button>
    </div>
  );
};
