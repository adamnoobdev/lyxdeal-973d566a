
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";
import { useEffect, useState } from "react";
import { DealFormProvider } from "@/components/deal-form/DealFormContext";

interface EditDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: FormValues;
}

export const EditDealDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditDealDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Controlled closing to avoid freezing
  const handleClose = () => {
    if (isSubmitting) return;
    
    setIsClosing(true);
    
    // Delayed closing to allow animation and clean-up
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Handle form submission with protection against multiple calls
  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) {
      console.log("[EditDealDialog] Submission already in progress, ignoring");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("[EditDealDialog] Starting submission");
      await onSubmit(values);
      console.log("[EditDealDialog] Submission successful, closing dialog");
      handleClose();
    } catch (error) {
      console.error("[EditDealDialog] Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DialogHeader className="space-y-2">
          <DialogTitle>
            {initialValues ? "Redigera erbjudande" : "Skapa erbjudande"}
          </DialogTitle>
          <DialogDescription>
            Fyll i informationen nedan för att {initialValues ? "uppdatera" : "skapa"} ett erbjudande
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <DealFormProvider initialValues={initialValues} externalIsSubmitting={isSubmitting}>
            <DealForm 
              onSubmit={handleSubmit} 
              initialValues={initialValues}
              isSubmitting={isSubmitting}
            />
          </DealFormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
