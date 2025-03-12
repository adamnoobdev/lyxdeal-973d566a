
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";
import { useState, useEffect } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!isOpen) {
      // Add a small delay before resetting to prevent UI glitches
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      // Successfully submitted, now close the dialog
      setTimeout(() => {
        if (onClose) onClose();
        setTimeout(() => setIsSubmitting(false), 100);
      }, 300);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6 rounded-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl text-primary">
            {initialValues ? "Redigera erbjudande" : "Skapa erbjudande"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fyll i informationen nedan för att {initialValues ? "uppdatera" : "skapa"} ett erbjudande
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 h-full overflow-y-auto px-1">
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
