import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { CheckoutForm } from "@/components/deal/CheckoutForm";
import { SuccessView } from "@/components/deal/SuccessView";
import { Tag } from "lucide-react";
interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: number;
  dealTitle: string;
  isFree?: boolean;
}
export const CheckoutDialog = ({
  isOpen,
  onClose,
  dealId,
  dealTitle,
  isFree = false
}: CheckoutDialogProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const handleSuccess = (code: string) => {
    setDiscountCode(code);
    setShowSuccess(true);
  };
  const handleClose = () => {
    setShowSuccess(false);
    setDiscountCode("");
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-4">
          {!showSuccess}
          <DialogTitle className="text-xl">
            {showSuccess ? "Tack för ditt intresse!" : `Säkra "${dealTitle}"`}
          </DialogTitle>
          {!showSuccess && <DialogDescription className="text-base">
              Fyll i dina uppgifter för att få en exklusiv rabattkod. 
              Koden är giltig i 72 timmar efter att du mottagit den.
            </DialogDescription>}
        </DialogHeader>

        {showSuccess ? <SuccessView dealTitle={dealTitle} discountCode={discountCode} onClose={handleClose} /> : <CheckoutForm dealId={dealId} onSuccess={handleSuccess} onCancel={handleClose} isFree={isFree} />}
      </DialogContent>
    </Dialog>;
};