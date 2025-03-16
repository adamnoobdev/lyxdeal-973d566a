
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
}

export const DiscountCodesDialog = ({
  isOpen,
  onClose,
  deal
}: DiscountCodesDialogProps) => {
  console.log(`[DiscountCodesDialog] 🔄 Rendering with isOpen=${isOpen}, deal=${deal?.id || 'null'}`);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DiscountCodesDialogContent 
          isOpen={isOpen} 
          deal={deal} 
        />
      </DialogContent>
    </Dialog>
  );
};
