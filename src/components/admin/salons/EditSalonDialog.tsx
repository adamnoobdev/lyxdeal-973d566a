
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
      
      // Validera att vi har adressinformation
      const hasAddressInfo = values.street || values.postalCode || values.city;
      if (hasAddressInfo && (!values.street || !values.postalCode || !values.city)) {
        toast.warning("Adressinformationen kan vara ofullständig. Kontrollera att du fyllt i gata, postnummer och stad.");
      }
      
      await onSubmit(values);
      handleClose();
      toast.success("Salonginformationen har uppdaterats");
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Ett fel uppstod när salongen skulle uppdateras");
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
          <DialogDescription>
            Uppdatera information om salongen. Fyll i adressinformation för korrekt visning på kartan.
          </DialogDescription>
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
