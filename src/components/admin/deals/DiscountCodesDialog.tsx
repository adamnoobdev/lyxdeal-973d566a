
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
  const { discountCodes, isLoading, error, refetch } = useDiscountCodes(isOpen ? deal?.id : undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset internal state when dialog opens/closes and trigger refetch when dialog opens
  useEffect(() => {
    if (isOpen && deal?.id) {
      console.log("Discount codes dialog opened, triggering refetch for deal ID:", deal.id);
      setIsLoaded(true);
      // Force a refetch when the dialog opens to get fresh data
      refetch();
    }
  }, [isOpen, deal?.id, refetch]);

  if (error) {
    console.error("Error loading discount codes:", error);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DialogHeader className="space-y-2">
          <DialogTitle>Rabattkoder - {deal?.title}</DialogTitle>
          <DialogDescription>
            Här ser du alla rabattkoder som genererats för detta erbjudande och deras status.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto mt-4">
          <DiscountCodesTable codes={discountCodes} isLoading={isLoading || !isLoaded} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
