
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialogContent } from "./discount-code-dialog/DiscountCodesDialogContent";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

interface DiscountCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesDialog = ({
  isOpen,
  onClose,
  deal,
  onGenerateDiscountCodes
}: DiscountCodesDialogProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Säkerställ att komponenten är monterad innan den visas
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Använd sheet på mobil för bättre upplevelse
  const isMobile = window.innerWidth < 768;

  if (!isMounted) return null;
  
  if (isMobile) {
    return (
      <Sheet 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <SheetContent className="w-full h-[90vh] overflow-auto p-4">
          {deal && (
            <DiscountCodesDialogContent 
              isOpen={isOpen} 
              deal={deal}
              onGenerateDiscountCodes={onGenerateDiscountCodes}
            />
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent 
        className="w-[95vw] max-w-3xl h-[90vh] p-6 overflow-hidden flex flex-col"
        onInteractOutside={(e) => {
          // Förhindra stängning när man klickar utanför om någon aktiv operation pågår
          if (deal && (deal.id < 0 || deal.id === undefined)) {
            e.preventDefault();
          }
        }}
      >
        {deal && (
          <DiscountCodesDialogContent 
            isOpen={isOpen} 
            deal={deal}
            onGenerateDiscountCodes={onGenerateDiscountCodes}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
