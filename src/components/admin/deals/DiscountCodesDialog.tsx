
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DiscountCodesTable } from "@/components/discount-codes/DiscountCodesTable";
import { useDiscountCodes } from "@/hooks/useDiscountCodes";
import { Deal } from "@/components/admin/types";
import { useState, useEffect } from "react";

interface DiscountCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

export const DiscountCodesDialog = ({
  isOpen,
  onClose,
  deal,
}: DiscountCodesDialogProps) => {
  const { discountCodes, isLoading, error } = useDiscountCodes(deal?.id);
  const [isClosing, setIsClosing] = useState(false);

  // Reset internal state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Handle controlled closing to prevent UI freezes
  const handleClose = () => {
    setIsClosing(true);
    // Use a small timeout to allow for smooth transition
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Longer timeout for better performance
  };

  if (error) {
    console.error("Error loading discount codes:", error);
  }

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DialogHeader className="space-y-2">
          <DialogTitle>Rabattkoder - {deal?.title}</DialogTitle>
          <DialogDescription>
            Här ser du alla rabattkoder som genererats för detta erbjudande och deras status.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto mt-4">
          <DiscountCodesTable codes={discountCodes} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
