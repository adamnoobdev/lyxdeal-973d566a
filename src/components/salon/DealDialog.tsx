
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";
import { useState, useEffect } from "react";
import { DealFormProvider } from "@/components/deal-form/DealFormContext";

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: FormValues;
}

export const DealDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: DealDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Controlled closing to avoid state issues
  const handleClose = () => {
    if (isSubmitting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) {
      console.log("[DealDialog] Submission already in progress, ignoring");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("[DealDialog] Starting submission");
      await onSubmit(values);
      console.log("[DealDialog] Submission successful, closing dialog");
      handleClose();
    } catch (error) {
      console.error("[DealDialog] Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Redigera Erbjudande" : "Skapa Erbjudande"}
          </DialogTitle>
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
