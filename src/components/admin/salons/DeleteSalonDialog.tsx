
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
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  salonName?: string;
  salonId?: number;
  userId?: string | null;
}

export const DeleteSalonDialog = ({
  isOpen,
  onClose,
  onConfirm,
  salonName,
  salonId,
  userId,
}: DeleteSalonDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isMountedRef = useRef(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track mount status
  useEffect(() => {
    isMountedRef.current = true;
    console.log("[DeleteSalonDialog] Component mounted");
    
    return () => {
      console.log("[DeleteSalonDialog] Component unmounting");
      isMountedRef.current = false;
      
      // Clear any pending timeouts on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Reset state when the dialog opens with mount check
  useEffect(() => {
    if (isOpen && isMountedRef.current) {
      console.log("[DeleteSalonDialog] Dialog opening for salon:", salonName);
      setIsDeleting(false);
      setIsClosing(false);
    }
  }, [isOpen, salonName]);

  // Controlled close function to prevent UI freeze
  const handleClose = () => {
    if (isDeleting) {
      console.log("[DeleteSalonDialog] Cannot close during deletion process");
      return;
    }
    
    console.log("[DeleteSalonDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Set new timeout
    closeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        console.log("[DeleteSalonDialog] Executing close callback");
        onClose();
        
        // Reset closing state after a brief delay
        closeTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.log("[DeleteSalonDialog] Resetting closing state");
            setIsClosing(false);
          }
        }, 100);
      }
    }, 200);
  };

  const handleDelete = async () => {
    if (!salonId || isDeleting) return;

    setIsDeleting(true);
    console.log("[DeleteSalonDialog] Starting delete process for salon:", salonId);
    
    try {
      // Om det finns ett userId, försök ta bort relaterade poster i salon_user_status först
      if (userId) {
        console.log(`[DeleteSalonDialog] Attempting to delete salon_user_status for user: ${userId}`);
        const { error: statusError } = await supabase
          .from('salon_user_status')
          .delete()
          .eq('user_id', userId);
          
        if (statusError) {
          console.error("[DeleteSalonDialog] Error deleting salon_user_status:", statusError);
          toast.error(`Kunde inte ta bort användarstatus: ${statusError.message}`);
        } else {
          console.log(`[DeleteSalonDialog] Successfully removed salon_user_status for user: ${userId}`);
        }
      }
      
      // Call the onConfirm callback that handles deletion of salon data
      await onConfirm();
      console.log("[DeleteSalonDialog] Deletion successful, closing dialog");
      
      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error("[DeleteSalonDialog] Error in delete process:", error);
      toast.error("Ett fel uppstod vid borttagning");
      
      if (isMountedRef.current) {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AlertDialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => {
        console.log("[DeleteSalonDialog] Dialog open state changed to:", open, "deleting:", isDeleting);
        if (!open && !isDeleting) handleClose();
      }}
    >
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
          <AlertDialogDescription>
            Detta kommer permanent ta bort salongen{" "}
            {salonName && <strong>"{salonName}"</strong>}. Denna åtgärd kan inte
            ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              if (!isDeleting) handleClose();
            }}
          >
            Avbryt
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }} 
            disabled={isDeleting}
            className={`w-full sm:w-auto ${isDeleting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isDeleting ? "Tar bort..." : "Ta bort"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
