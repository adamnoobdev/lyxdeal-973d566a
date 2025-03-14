
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
  console.log(`[DiscountCodesDialog] 🔄 Rendering with isOpen=${isOpen}, deal=${deal?.id || 'null'}`);
  
  const handleGenerateDiscountCodes = async (quantity: number) => {
    if (deal && onGenerateDiscountCodes) {
      await onGenerateDiscountCodes(deal, quantity);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DiscountCodesDialogContent 
          isOpen={isOpen} 
          deal={deal} 
          onGenerateDiscountCodes={onGenerateDiscountCodes ? handleGenerateDiscountCodes : undefined}
        />
      </DialogContent>
    </Dialog>
  );
};
