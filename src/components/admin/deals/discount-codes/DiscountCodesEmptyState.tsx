
import React from 'react';
import { Deal } from "@/components/admin/types";
import { AlertCircle, PlusCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTestGenerateActions } from "@/hooks/useTestGenerateActions";

interface DiscountCodesEmptyStateProps {
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesEmptyState: React.FC<DiscountCodesEmptyStateProps> = ({
  deal,
  onGenerateDiscountCodes
}) => {
  const { isGenerating, handleGenerateTestCodes } = useTestGenerateActions(
    deal?.id || 0, 
    () => {
      // This will refresh the dialog content after test codes are generated
      setTimeout(() => {
        if (onGenerateDiscountCodes && deal) {
          onGenerateDiscountCodes(deal, 0); // Passing 0 to use this just for refreshing
        }
      }, 500);
    }
  );
  
  if (!deal) return null;
  
  if (deal.requires_discount_code === false) {
    return (
      <div className="text-center p-4 bg-blue-50 rounded-md">
        <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
          <Info className="h-5 w-5" />
          <h3 className="font-medium">Detta erbjudande använder direktbokning</h3>
        </div>
        <p className="text-blue-600 text-sm">
          Inga rabattkoder används för detta erbjudande. Kunder dirigeras direkt till bokningssidan.
        </p>
        {deal.booking_url && (
          <a 
            href={deal.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-blue-700 hover:text-blue-800 text-sm"
          >
            <span>Öppna bokningslänk</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-12 w-12 text-amber-400" />
        <h3 className="text-lg font-medium">Inga rabattkoder hittades</h3>
        
        <p className="text-muted-foreground max-w-sm mx-auto mb-4">
          {deal.quantity_left > 0 
            ? `Detta erbjudande har inställt att använda rabattkoder men inga har genererats än.`
            : `Alla rabattkoder för detta erbjudande har använts.`
          }
        </p>
        
        {onGenerateDiscountCodes && (
          <Button 
            onClick={() => onGenerateDiscountCodes(deal, 10)} 
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Generera 10 rabattkoder</span>
          </Button>
        )}
        
        <div className="mt-4">
          <Button
            variant="outline" 
            onClick={handleGenerateTestCodes}
            disabled={isGenerating}
            size="sm"
            className="text-xs"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Genererar testkoder...</span>
              </>
            ) : (
              <>
                <span>Generera 5 testkoder (utvecklare)</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
