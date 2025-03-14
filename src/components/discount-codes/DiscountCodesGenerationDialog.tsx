
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

interface DiscountCodesGenerationDialogProps {
  onGenerate: (quantity: number) => Promise<void>;
  trigger?: React.ReactNode;
  isDisabled?: boolean;
}

export const DiscountCodesGenerationDialog = ({
  onGenerate,
  trigger,
  isDisabled = false,
}: DiscountCodesGenerationDialogProps) => {
  const [quantity, setQuantity] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onGenerate(quantity);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to generate discount codes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            size="sm"
            className="gap-2 bg-purple-900 hover:bg-purple-800"
            disabled={isDisabled}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Generera koder</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generera rabattkoder</DialogTitle>
          <DialogDescription>
            Ange antalet rabattkoder du vill generera för det här erbjudandet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Antal
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2 bg-purple-900 hover:bg-purple-800"
            >
              <PlusCircle className={`h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
              <span>Generera {quantity} koder</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
