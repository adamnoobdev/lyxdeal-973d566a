
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";
import { useState, useEffect } from "react";

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
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset internal state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle controlled closing to prevent UI freezes
  const handleClose = () => {
    if (isSubmitting) return; // Don't close during submission
    
    setIsClosing(true);
    // Use a small timeout to allow for smooth transition
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Handle form submission with state tracking
  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      // Don't call handleClose here - this allows the parent component
      // to control when the dialog actually closes
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 300);
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
          <DealForm 
            onSubmit={handleSubmit} 
            initialValues={initialValues}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
