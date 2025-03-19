
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
  const [isMounted, setIsMounted] = useState(false);
  
  // Säkerställ att komponenten är monterad innan den visas
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Reset isDeleting when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);
  
  // Controlled delete with state tracking
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error("Error during delete:", error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!isMounted) return null;

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onClose();
        }
      }}
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
          <AlertDialogCancel 
            onClick={() => {
              if (!isDeleting) onClose();
            }} 
            disabled={isDeleting}
          >
            Avbryt
          </AlertDialogCancel>
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
