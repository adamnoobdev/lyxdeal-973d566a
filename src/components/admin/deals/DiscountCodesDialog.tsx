
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialogContent } from "./discount-code-dialog/DiscountCodesDialogContent";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { toast } from "sonner";

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
  
  // Om ingen extern handler för generering av koder skickats, använd standardimplementeringen
  const handleGenerateDiscountCodes = async (dealToUpdate: Deal, quantity: number) => {
    if (!onGenerateDiscountCodes) {
      try {
        await toast.promise(
          generateDiscountCodes(dealToUpdate.id, quantity), 
          {
            loading: `Genererar ${quantity} rabattkoder...`,
            success: `${quantity} rabattkoder genererades`,
            error: 'Kunde inte generera rabattkoder'
          }
        );
        return Promise.resolve();
      } catch (error) {
        console.error("[DiscountCodesDialog] Error generating codes:", error);
        return Promise.reject(error);
      }
    } else {
      return onGenerateDiscountCodes(dealToUpdate, quantity);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DiscountCodesDialogContent 
          isOpen={isOpen} 
          deal={deal} 
          onGenerateDiscountCodes={handleGenerateDiscountCodes}
        />
      </DialogContent>
    </Dialog>
  );
};
