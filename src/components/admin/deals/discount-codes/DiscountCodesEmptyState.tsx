
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Deal } from '@/types/deal';
import { Button } from '@/components/ui/button';

interface DiscountCodesEmptyStateProps {
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesEmptyState = ({ 
  deal, 
  onGenerateDiscountCodes 
}: DiscountCodesEmptyStateProps) => {
  const handleGenerateDiscountCodes = async () => {
    if (deal && onGenerateDiscountCodes) {
      await onGenerateDiscountCodes(deal, 10);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 space-y-4 text-center">
      <div className="rounded-full bg-gray-100 p-3">
        <PlusCircle className="h-8 w-8 text-gray-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-1">Inga rabattkoder</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Det finns inga rabattkoder för detta erbjudande ännu. 
          Generera rabattkoder för att möjliggöra kundbokningar.
        </p>
      </div>
      
      {onGenerateDiscountCodes && deal && (
        <Button 
          onClick={handleGenerateDiscountCodes}
          className="mt-4"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Generera 10 rabattkoder
        </Button>
      )}
    </div>
  );
};
