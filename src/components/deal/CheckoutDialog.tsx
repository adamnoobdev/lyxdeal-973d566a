
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { CheckoutForm } from "@/components/deal/CheckoutForm";
import { SuccessView } from "@/components/deal/SuccessView";
import { Tag, AlertCircle } from "lucide-react";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  
  const handleSuccess = (code: string) => {
    setDiscountCode(code);
    setShowSuccess(true);
    setErrorMessage(null);
  };
  
  const handleError = (message: string) => {
    setErrorMessage(message);
  };
  
  const handleClose = () => {
    setShowSuccess(false);
    setDiscountCode("");
    setErrorMessage(null);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-md w-[calc(100%-2rem)] mx-auto">
        <DialogHeader className="text-center space-y-4">
          {errorMessage ? (
            <div className="mx-auto bg-red-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          ) : !showSuccess ? (
            <div className="mx-auto bg-primary/5 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Tag className="w-8 h-8 text-primary" />
            </div>
          ) : null}
          
          <DialogTitle className="text-xl">
            {errorMessage ? "Problem uppstod" : 
             showSuccess ? "Tack för ditt intresse!" : 
             `Säkra "${dealTitle}"`}
          </DialogTitle>
          
          {errorMessage ? (
            <DialogDescription className="text-base text-red-600">
              {errorMessage}
            </DialogDescription>
          ) : !showSuccess ? (
            <DialogDescription className="text-base">
              Fyll i dina uppgifter för att få en exklusiv rabattkod. 
              Koden är giltig i 72 timmar efter att du mottagit den.
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {errorMessage ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Försök igen senare eller kontakta kundtjänst om problemet kvarstår.
            </p>
            <Button onClick={handleClose} className="w-full">Stäng</Button>
          </div>
        ) : showSuccess ? (
          <SuccessView 
            dealTitle={dealTitle} 
            discountCode={discountCode}
            onClose={handleClose}
          />
        ) : (
          <CheckoutForm 
            dealId={dealId} 
            onSuccess={handleSuccess}
            onError={handleError}
            onCancel={handleClose}
            isFree={isFree}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Importerar Button lokalt inom denna fil för att undvika cirkulära beroenden
const Button = ({ className, ...props }: React.ComponentPropsWithoutRef<"button"> & { className?: string }) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ${className}`}
      {...props}
    />
  );
};
