
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DiscountCodesGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (quantity: number) => Promise<void>;
  dealTitle?: string;
}

export const DiscountCodesGenerationDialog = ({
  isOpen,
  onClose,
  onGenerate,
  dealTitle
}: DiscountCodesGenerationDialogProps) => {
  const [quantity, setQuantity] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 100) {
      setQuantity(value);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      await onGenerate(quantity);
      onClose();
    } catch (error) {
      console.error("Error generating discount codes:", error);
      toast.error("Kunde inte generera rabattkoder", {
        description: "Ett fel uppstod. Försök igen senare."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generera rabattkoder</DialogTitle>
          <DialogDescription>
            {dealTitle ? 
              `Ange antal rabattkoder att generera för "${dealTitle}"` :
              "Ange antal rabattkoder att generera för detta erbjudande"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="quantity" className="sr-only">
              Antal
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={100}
              className="w-full"
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            rabattkoder
          </span>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isGenerating}
          >
            Avbryt
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Genererar...
              </>
            ) : (
              <>Generera {quantity} rabattkoder</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
