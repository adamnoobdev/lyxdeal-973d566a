
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
  onViewDiscountCodes?: (deal: Deal) => void;
}

export const DealsSection = ({
  title,
  deals,
  alertVariant = "default",
  alertMessage,
  onEdit,
  onDelete,
  onViewDetails,
  onViewDiscountCodes,
}: DealsSectionProps) => {
  if (!deals.length) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
        <h2 className="text-lg xs:text-xl font-semibold">{title}</h2>
        {deals.length > 0 && onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(deals[0])}
            className="w-full xs:w-auto text-xs"
          >
            <ExternalLink className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4" />
            Se detaljer
          </Button>
        )}
      </div>
      
      {alertMessage && (
        <Alert variant={alertVariant} className="py-2 text-xs xs:text-sm">
          {alertVariant === "destructive" && <AlertCircle className="h-3 w-3 xs:h-4 xs:w-4" />}
          <AlertDescription className="text-xs xs:text-sm">{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      <DealsTable 
        deals={deals} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        onToggleActive={undefined}
        onPreview={onViewDetails}
        onViewDiscountCodes={onViewDiscountCodes}
        isSalonView={title === "Aktiva erbjudanden" && !!onViewDiscountCodes}
      />
    </div>
  );
};
