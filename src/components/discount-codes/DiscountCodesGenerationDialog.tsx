
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DiscountCodesGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (quantity: number) => Promise<void>;
}

export const DiscountCodesGenerationDialog = ({
  isOpen,
  onClose,
  onGenerate
}: DiscountCodesGenerationDialogProps) => {
  const [quantity, setQuantity] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await onGenerate(quantity);
      onClose();
    } catch (error) {
      console.error("Error generating discount codes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generera rabattkoder</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Antal rabattkoder</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Du kan generera upp till 500 rabattkoder åt gången.
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isGenerating}
          >
            Avbryt
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || quantity < 1 || quantity > 500}
          >
            {isGenerating ? "Genererar..." : "Generera koder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
