
import { useState, useEffect, useRef } from "react";
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
  const isMountedRef = useRef(true);
  const deleteActionTriggeredRef = useRef(false);
  
  // Reset refs and state when component mounts/unmounts
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
      setIsDialogClosing(false);
      deleteActionTriggeredRef.current = false;
    }
  }, [isOpen]);
  
  // Safe close function with state management
  const handleClose = () => {
    if (isDeleting || isDialogClosing) {
      return;
    }
    
    setIsDialogClosing(true);
    
    // Slight delay to allow animation
    setTimeout(() => {
      if (isMountedRef.current) {
        onClose();
        
        // Reset dialog state after close is complete
        setTimeout(() => {
          if (isMountedRef.current) {
            setIsDialogClosing(false);
          }
        }, 300);
      }
    }, 50);
  };
  
  // Handle delete with state tracking
  const handleDelete = async () => {
    if (isDeleting || isDialogClosing || deleteActionTriggeredRef.current) {
      return;
    }
    
    try {
      deleteActionTriggeredRef.current = true;
      setIsDeleting(true);
      
      await onConfirm();
      
      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error("[DeleteDealDialog] Error during delete:", error);
      if (isMountedRef.current) {
        setIsDeleting(false);
        deleteActionTriggeredRef.current = false;
      }
    }
  };

  return (
    <AlertDialog 
      open={isOpen && !isDialogClosing} 
      onOpenChange={(open) => {
        if (!open && !isDeleting && !isDialogClosing) {
          handleClose();
        }
      }}
    >
      <AlertDialogContent className="max-w-md mx-auto">
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
