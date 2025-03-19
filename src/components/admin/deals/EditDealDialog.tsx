
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
import { DealFormProvider } from "@/components/deal-form/DealFormContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
  const [isMounted, setIsMounted] = useState(false);
  
  // Säkerställ att komponenten är monterad innan den visas
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) {
      console.log("[EditDealDialog] Submission already in progress, ignoring");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("[EditDealDialog] Starting submission");
      await onSubmit(values);
      console.log("[EditDealDialog] Submission successful");
    } catch (error) {
      console.error("[EditDealDialog] Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      console.log("[EditDealDialog] Finished submission, will close dialog");
    }
  };

  // Safe close function that checks submission state
  const handleClose = () => {
    if (!isSubmitting) {
      console.log("[EditDealDialog] Closing dialog");
      onClose();
    } else {
      console.log("[EditDealDialog] Cannot close during submission");
    }
  };

  if (!isMounted) return null;

  // Använd Sheet på mobil för bättre UX
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <Sheet 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <SheetContent className="w-full h-[90vh] p-4 overflow-auto flex flex-col">
          <SheetHeader className="space-y-2">
            <SheetTitle>
              {initialValues ? "Redigera erbjudande" : "Skapa erbjudande"}
            </SheetTitle>
            <SheetDescription>
              Fyll i informationen nedan för att {initialValues ? "uppdatera" : "skapa"} ett erbjudande
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-auto mt-4">
            <DealFormProvider initialValues={initialValues} externalIsSubmitting={isSubmitting}>
              <DealForm 
                onSubmit={handleSubmit} 
                initialValues={initialValues}
                isSubmitting={isSubmitting}
              />
            </DealFormProvider>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog 
      open={isOpen} 
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
          <DealFormProvider initialValues={initialValues} externalIsSubmitting={isSubmitting}>
            <DealForm 
              onSubmit={handleSubmit} 
              initialValues={initialValues}
              isSubmitting={isSubmitting}
            />
          </DealFormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
