
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
    if (isDeleting || isDialogClosing) return;
    
    setIsDialogClosing(true);
    // Small delay to allow state to update before calling onClose
    setTimeout(() => {
      onClose();
      // Reset state after closing
      setTimeout(() => {
        setIsDialogClosing(false);
      }, 50);
    }, 10);
  };
  
  // Controlled delete with state tracking
  const handleDelete = async () => {
    if (isDeleting || isDialogClosing) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error("Error during delete:", error);
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
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
