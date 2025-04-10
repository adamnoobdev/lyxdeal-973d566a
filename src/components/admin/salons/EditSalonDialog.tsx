
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useEditSalonDialog } from "./hooks/useEditSalonDialog";
import { EditSalonDialogContent } from "./dialog/EditSalonDialogContent";
import { Skeleton } from "@/components/ui/skeleton";

interface EditSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  isLoading?: boolean;
}

export const EditSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false
}: EditSalonDialogProps) => {
  const [isMounted, setIsMounted] = useState(false);

  // Use the extracted hook for dialog logic
  const {
    isClosing,
    isSubmitting,
    debugView,
    formRef,
    setDebugView,
    handleClose,
    handleSubmit,
    handleSubscriptionUpdated
  } = useEditSalonDialog({
    isOpen,
    onClose,
    onSubmit,
    initialValues
  });

  // Ensure component mounting is tracked
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <EditSalonDialogContent
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            formRef={formRef}
            debugView={debugView}
            setDebugView={setDebugView}
            onSubscriptionUpdated={handleSubscriptionUpdated}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
