
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
  const [isClosing, setIsClosing] = useState(false);
  
  // Säkerställ att komponenten är monterad innan den visas
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen && isMounted) {
      setIsDeleting(false);
      setIsClosing(false);
    }
  }, [isOpen, isMounted]);
  
  // Förbättrad stängningsfunktion för att förhindra UI-frysning
  const handleClose = () => {
    if (isDeleting) return;
    
    // Anropa först onClose direkt för att tillåta föräldrakomponenter att uppdatera sin state
    onClose();
    
    // Sätt vår interna stängningsstate med en liten fördröjning
    setTimeout(() => {
      if (isMounted) {
        setIsClosing(true);
        setTimeout(() => {
          if (isMounted) {
            setIsClosing(false);
          }
        }, 200);
      }
    }, 10);
  };
  
  // Controlled delete with state tracking
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error("Error during delete:", error);
      if (isMounted) {
        setIsDeleting(false);
      }
    }
  };

  if (!isMounted) return null;

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          handleClose();
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
            onClick={(e) => {
              e.preventDefault();
              if (!isDeleting) handleClose();
            }} 
            disabled={isDeleting}
          >
            Avbryt
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Tar bort..." : "Ta bort"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
