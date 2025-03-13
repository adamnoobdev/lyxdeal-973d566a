
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

interface EditDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: FormValues;
  isSubmitting?: boolean;
}

export const EditDealDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isSubmitting = false,
}: EditDealDialogProps) => {
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      // Reset internal submitting state when dialog closes
      setTimeout(() => {
        setInternalIsSubmitting(false);
      }, 300);
    }
  }, [isOpen]);
  
  const handleSubmit = async (values: FormValues) => {
    try {
      setInternalIsSubmitting(true);
      await onSubmit(values);
      // Success will be handled by parent component
    } catch (error) {
      console.error("Error in EditDealDialog handleSubmit:", error);
    } 
  };
  
  const preventCloseWhenSubmitting = isSubmitting || internalIsSubmitting;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !preventCloseWhenSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6 overflow-hidden">
        <DialogHeader className="space-y-2">
          <DialogTitle>
            {initialValues ? "Redigera erbjudande" : "Skapa erbjudande"}
          </DialogTitle>
          <DialogDescription>
            Fyll i informationen nedan för att {initialValues ? "uppdatera" : "skapa"} ett erbjudande
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 h-full">
          <DealForm 
            onSubmit={handleSubmit} 
            initialValues={initialValues} 
            isSubmitting={preventCloseWhenSubmitting} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
