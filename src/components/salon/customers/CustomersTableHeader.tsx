
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CustomersTableHeaderProps {
  onExport: () => void;
}

export const CustomersTableHeader = ({ onExport }: CustomersTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Kunder som säkrat erbjudanden</h3>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExport}
        className="text-xs hover:text-primary"
      >
        <Download className="h-3 w-3 mr-1" />
        Exportera
      </Button>
    </div>
  );
};
