
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

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Safe close function that checks submission state
  const handleClose = () => {
    if (!isSubmitting) {
      console.log("[DealDialog] Closing dialog");
      onClose();
    } else {
      console.log("[DealDialog] Cannot close during submission");
    }
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
      console.log("[DealDialog] Submission successful");
    } catch (error) {
      console.error("[DealDialog] Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      console.log("[DealDialog] Finished submission, will close dialog");
      handleClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
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
