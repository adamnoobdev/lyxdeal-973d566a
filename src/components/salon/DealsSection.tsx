
import { Deal } from "@/components/admin/types";
import { DealsTable } from "@/components/admin/deals/DealsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealsSectionProps {
  title: string;
  deals: Deal[];
  alertVariant?: "default" | "destructive";
  alertMessage?: string;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onViewDetails?: (deal: Deal) => void;
}

export const DealsSection = ({
  title,
  deals,
  alertVariant = "default",
  alertMessage,
  onEdit,
  onDelete,
  onViewDetails,
}: DealsSectionProps) => {
  if (!deals.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {deals.length > 0 && onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(deals[0])}
            className="sm:self-end"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Se detaljer
          </Button>
        )}
      </div>
      
      {alertMessage && (
        <Alert variant={alertVariant}>
          {alertVariant === "destructive" && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      <DealsTable 
        deals={deals} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        onToggleActive={undefined}
        onPreview={onViewDetails}
      />
    </div>
  );
};
