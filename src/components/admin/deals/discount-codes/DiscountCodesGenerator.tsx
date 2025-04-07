
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Deal } from "@/components/admin/types";
import { DiscountCodesGenerationDialog } from "@/components/discount-codes/DiscountCodesGenerationDialog";

interface DiscountCodesGeneratorProps {
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
  isGeneratingCodes?: boolean;
}

export const DiscountCodesGenerator = ({
  deal,
  onGenerateDiscountCodes,
  isGeneratingCodes = false
}: DiscountCodesGeneratorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!deal || !onGenerateDiscountCodes) return null;
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleGenerate = (quantity: number) => {
    if (deal) {
      onGenerateDiscountCodes(deal, quantity);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">Generera nya rabattkoder</h3>
          <p className="text-sm text-muted-foreground">
            Skapa fler rabattkoder för detta erbjudande
          </p>
        </div>
        
        <Button 
          onClick={handleOpenDialog}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          disabled={isGeneratingCodes}
        >
          {isGeneratingCodes ? (
            <span>Genererar...</span>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Generera koder</span>
            </>
          )}
        </Button>
      </div>
      
      <DiscountCodesGenerationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onGenerate={handleGenerate}
        dealTitle={deal.title}
      />
    </div>
  );
};
