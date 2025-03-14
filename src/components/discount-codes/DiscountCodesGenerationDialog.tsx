
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DiscountCodesGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (quantity: number) => void;
  dealTitle?: string;
}

export const DiscountCodesGenerationDialog = ({
  isOpen,
  onClose,
  onGenerate,
  dealTitle
}: DiscountCodesGenerationDialogProps) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleGenerate = () => {
    if (quantity <= 0 || quantity > 100) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onGenerate(quantity);
    } catch (error) {
      console.error("Error generating codes:", error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generera rabattkoder</DialogTitle>
          <DialogDescription>
            {dealTitle 
              ? `Skapa nya rabattkoder för "${dealTitle}"`
              : "Skapa nya rabattkoder för detta erbjudande"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Antal rabattkoder</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
              />
              <p className="text-xs text-muted-foreground">
                Du kan generera mellan 1 och 100 koder åt gången.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button onClick={handleGenerate} disabled={isSubmitting || quantity <= 0 || quantity > 100}>
            {isSubmitting ? "Genererar..." : "Generera koder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
