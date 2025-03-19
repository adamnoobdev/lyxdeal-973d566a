
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialogContent } from "./discount-code-dialog/DiscountCodesDialogContent";

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
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          // Delay state update to next event loop to avoid React state issues
          setTimeout(() => {
            onClose();
          }, 300);
        }
      }}
    >
      <DialogContent 
        className="w-[95vw] max-w-3xl h-[90vh] p-6 overflow-hidden flex flex-col"
        onInteractOutside={(e) => {
          // Prevent closing when clicking outside if there's an active operation
          e.preventDefault();
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
