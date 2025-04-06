
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";
import { useState, useEffect, useRef } from "react";
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
  const [isMounted, setIsMounted] = useState(false);
  const initialRenderRef = useRef(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure component is mounted
  useEffect(() => {
    setIsMounted(true);
    console.log("[EditSalonDialog] Component mounted");
    
    return () => {
      console.log("[EditSalonDialog] Component unmounting");
      setIsMounted(false);
      
      // Clear any pending timeouts on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Reset state when dialog opens with improved handling
  useEffect(() => {
    // Skip the first render to avoid state flashing
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (isOpen && isMounted) {
      console.log("[EditSalonDialog] Dialog opening, resetting state");
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen, isMounted]);

  // Handle controlled closing with timeout to allow animations
  const handleClose = () => {
    if (isSubmitting || !isMounted) {
      console.log("[EditSalonDialog] Cannot close: isSubmitting=", isSubmitting, "isMounted=", isMounted);
      return;
    }
    
    console.log("[EditSalonDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Set new timeout
    closeTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        console.log("[EditSalonDialog] Executing close callback");
        onClose();
        
        // Reset closing state after a brief delay
        closeTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            console.log("[EditSalonDialog] Resetting closing state");
            setIsClosing(false);
          }
        }, 100);
      }
    }, 200);
  };

  // Handle form submission with improved state management
  const handleSubmit = async (values: any) => {
    if (isSubmitting || !isMounted) return;
    
    try {
      setIsSubmitting(true);
      console.log("[EditSalonDialog] Submitting form with values:", values);
      
      // Make sure fullAddress is used if a full raw address was entered
      if (values.fullAddress && !values.address) {
        values.address = values.fullAddress;
      }
      
      await onSubmit(values);
      
      if (isMounted) {
        toast.success("Salonginformationen har uppdaterats");
        handleClose();
      }
    } catch (error) {
      console.error("[EditSalonDialog] Error in form submission:", error);
      if (isMounted) {
        toast.error("Ett fel uppstod när salongen skulle uppdateras");
      }
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  };

  // Don't render anything if not mounted to prevent state issues
  if (!isMounted) {
    console.log("[EditSalonDialog] Not rendering because component is not mounted");
    return null;
  }

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => {
        console.log("[EditSalonDialog] Dialog open state changed to:", open, "submitting:", isSubmitting);
        if (!open && !isSubmitting) handleClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Redigera salong</DialogTitle>
          <DialogDescription>
            Uppdatera information om salongen. Fyll i adressinformation för korrekt visning på kartan och hantera godkännanden av villkor.
          </DialogDescription>
        </DialogHeader>
        <SalonForm 
          onSubmit={handleSubmit} 
          initialValues={initialValues} 
          isEditing={true}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
