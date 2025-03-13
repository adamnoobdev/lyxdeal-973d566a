
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
}

export const EditDealDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditDealDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);

  // Kontrollerad stängning för att undvika frysningar
  const handleClose = () => {
    setIsClosing(true);
    // Fördröjd stängning för att tillåta animation och clean-up
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 100);
  };

  // Återställ isClosing om dialogen öppnas igen
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6">
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
            onSubmit={onSubmit} 
            initialValues={initialValues} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
