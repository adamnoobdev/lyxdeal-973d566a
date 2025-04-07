
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
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 sm:gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{title}</h2>
        {deals.length > 0 && onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(deals[0])}
            className="w-full xs:w-auto text-xs sm:text-sm"
          >
            <ExternalLink className="mr-1.5 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4" />
            Se detaljer
          </Button>
        )}
      </div>
      
      {alertMessage && (
        <Alert variant={alertVariant} className="py-2.5 sm:py-3">
          {alertVariant === "destructive" && <AlertCircle className="h-3.5 w-3.5 xs:h-4 xs:w-4" />}
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
