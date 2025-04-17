
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExportButtonProps {
  onExport: () => void;
}

export function ExportButton({ onExport }: ExportButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onExport} 
      className="flex items-center gap-1 w-full sm:w-auto"
    >
      <Download className="h-4 w-4" />
      <span>Exportera</span>
    </Button>
  );
}
