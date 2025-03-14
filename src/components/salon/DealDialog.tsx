
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
