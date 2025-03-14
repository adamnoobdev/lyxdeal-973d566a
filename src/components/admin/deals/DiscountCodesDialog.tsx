
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialogContent } from "./discount-code-dialog/DiscountCodesDialogContent";
import { generateDiscountCodes } from "@/utils/discountCodeUtils";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
    if (!deal) return;
    
    try {
      if (onGenerateDiscountCodes) {
        await onGenerateDiscountCodes(deal, quantity);
      } else {
        // Use the utility function directly if no callback provided
        await toast.promise(
          generateDiscountCodes(deal.id, quantity),
          {
            loading: `Genererar ${quantity} rabattkoder...`,
            success: `${quantity} rabattkoder har genererats`,
            error: 'Kunde inte generera rabattkoder'
          }
        );
      }
    } catch (error) {
      console.error('[DiscountCodesDialog] Error generating codes:', error);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DialogTitle className="text-lg font-semibold">
          {deal ? `Rabattkoder för "${deal.title}"` : "Rabattkoder"}
        </DialogTitle>
        <DiscountCodesDialogContent 
          isOpen={isOpen} 
          deal={deal} 
          onGenerateDiscountCodes={handleGenerateDiscountCodes}
        />
      </DialogContent>
    </Dialog>
  );
};
