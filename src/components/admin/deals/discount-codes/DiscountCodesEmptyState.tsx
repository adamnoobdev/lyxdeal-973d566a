
import React from "react";
import { Deal } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DiscountCodesEmptyStateProps {
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesEmptyState = ({ 
  deal, 
  onGenerateDiscountCodes 
}: DiscountCodesEmptyStateProps) => {
  if (!deal) return null;

  const handleGenerateClick = async () => {
    if (deal && onGenerateDiscountCodes) {
      await onGenerateDiscountCodes(deal, 10);
    }
  };

  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium mb-2">Inga rabattkoder funna</h3>
      <p className="text-muted-foreground mb-6">
        Det finns inga rabattkoder genererade för detta erbjudande ännu.
      </p>
      
      {onGenerateDiscountCodes && (
        <Button onClick={handleGenerateClick} className="inline-flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Generera 10 rabattkoder</span>
        </Button>
      )}
    </div>
  );
};
