
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  dealTitle?: string;
}

export const DeleteDealDialog = ({
  isOpen,
  onClose,
  onConfirm,
  dealTitle,
}: DeleteDealDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogClosing, setIsDialogClosing] = useState(false);
  
  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
      setIsDialogClosing(false);
    }
  }, [isOpen]);
  
  // Safe close function with state management to prevent UI freezing
  const handleClose = () => {
    if (isDeleting || isDialogClosing) {
      console.log("[DeleteDealDialog] Already closing or deleting, skipping close request");
      return;
    }
    
    console.log("[DeleteDealDialog] Starting controlled close sequence");
    setIsDialogClosing(true);
    
    // Small delay to allow state to update before calling onClose
    setTimeout(() => {
      console.log("[DeleteDealDialog] Executing onClose callback");
      onClose();
      
      // Reset state after closing with a slight delay
      setTimeout(() => {
        console.log("[DeleteDealDialog] Resetting dialog closing state");
        setIsDialogClosing(false);
      }, 300);
    }, 100);
  };
  
  // Controlled delete with state tracking
  const handleDelete = async () => {
    if (isDeleting || isDialogClosing) {
      console.log("[DeleteDealDialog] Already deleting or closing, skipping delete request");
      return;
    }
    
    try {
      console.log("[DeleteDealDialog] Starting deletion process");
      setIsDeleting(true);
      await onConfirm();
      console.log("[DeleteDealDialog] Deletion completed, closing dialog");
      handleClose();
    } catch (error) {
      console.error("[DeleteDealDialog] Error during delete:", error);
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog 
      open={isOpen && !isDialogClosing} 
      onOpenChange={(open) => {
        console.log("[DeleteDealDialog] Dialog state changed to:", open);
        if (!open && !isDeleting && !isDialogClosing) {
          handleClose();
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
          <AlertDialogDescription>
            Detta kommer permanent ta bort erbjudandet{" "}
            {dealTitle && <strong>"{dealTitle}"</strong>}. Denna åtgärd kan inte
            ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={(e) => {
              e.preventDefault();
              if (!isDeleting && !isDialogClosing) handleClose();
            }} 
            disabled={isDeleting || isDialogClosing}
          >
            Avbryt
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting || isDialogClosing}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Tar bort..." : "Ta bort"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
