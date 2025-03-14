
import { useEffect, useState } from "react";
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
  onConfirm: () => void;
  dealTitle?: string;
}

export const DeleteDealDialog = ({
  isOpen,
  onClose,
  onConfirm,
  dealTitle,
}: DeleteDealDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsDeleting(false);
    }
  }, [isOpen]);
  
  // Controlled closing to prevent UI freezes
  const handleClose = () => {
    if (isDeleting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };
  
  // Controlled delete with state tracking
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
      // Don't call handleClose here - let the parent control when to close
    } finally {
      setTimeout(() => {
        setIsDeleting(false);
      }, 300);
    }
  };

  return (
    <AlertDialog 
      open={isOpen && !isClosing}
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
          <AlertDialogDescription>
            Detta kommer permanent ta bort erbjudandet{" "}
            {dealTitle && <strong>"{dealTitle}"</strong>}. Denna åtgärd kan inte
            ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Avbryt</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Tar bort..." : "Ta bort"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
