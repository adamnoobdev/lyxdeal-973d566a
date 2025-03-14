
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";
import { useState, useEffect } from "react";

interface EditSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
}

export const EditSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditSalonDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle controlled closing
  const handleClose = () => {
    if (isSubmitting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Redigera salong</DialogTitle>
        </DialogHeader>
        <SalonForm 
          onSubmit={handleSubmit} 
          initialValues={initialValues} 
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};
