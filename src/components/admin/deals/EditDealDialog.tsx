
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

  // Kontrollerad stängning för att undvika frysningar
  const handleClose = () => {
    if (isSubmittingRef.current) return;
    
    setIsClosing(true);
    
    // Rensa tidigare timeout om det finns
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Fördröjd stängning för att tillåta animation och clean-up
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, 150);
  };

  // Hantera formulärinlämning med skydd mot flera anrop
  const handleSubmit = async (values: FormValues) => {
    if (isSubmittingRef.current) return;
    
    try {
      isSubmittingRef.current = true;
      await onSubmit(values);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Återställ isClosing om dialogen öppnas igen och rensa timeout
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
    
    // Cleanup-funktion för att rensa timeout när komponenten avmonteras
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
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6 overflow-hidden">
        <DialogHeader className="space-y-2">
          <DialogTitle>
            {initialValues ? "Redigera erbjudande" : "Skapa erbjudande"}
          </DialogTitle>
          <DialogDescription>
            Fyll i informationen nedan för att {initialValues ? "uppdatera" : "skapa"} ett erbjudande
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 h-[calc(100%-120px)] overflow-auto">
          <DealForm 
            onSubmit={handleSubmit} 
            initialValues={initialValues} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
