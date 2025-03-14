
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";
import { useEffect, useState, useRef } from "react";

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
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmittingRef = useRef(false);

  // Controlled closing to avoid freezing
  const handleClose = () => {
    if (isSubmittingRef.current) return;
    
    setIsClosing(true);
    
    // Clear previous timeout if exists
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Delayed closing to allow animation and clean-up
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, 150);
  };

  // Handle form submission with protection against multiple calls
  const handleSubmit = async (values: FormValues) => {
    if (isSubmittingRef.current) return;
    
    try {
      isSubmittingRef.current = true;
      await onSubmit(values);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Reset isClosing if dialog opens again and clear timeout
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
    
    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen]);

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
          <DealForm 
            onSubmit={handleSubmit} 
            initialValues={initialValues} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
