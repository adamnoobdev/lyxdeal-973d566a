
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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  salonName?: string;
  salonId?: number;
  userId?: string;
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
  
  // Reset state when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Controlled close function to prevent UI freeze
  const handleClose = () => {
    if (isDeleting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setTimeout(() => setIsClosing(false), 100);
    }, 200);
  };

  const handleDelete = async () => {
    if (!salonId || isDeleting) return;

    setIsDeleting(true);
    
    try {
      // Om det finns ett userId, försök ta bort relaterade poster i salon_user_status först
      if (userId) {
        console.log(`Attempting to delete salon_user_status for user: ${userId}`);
        const { error: statusError } = await supabase
          .from('salon_user_status')
          .delete()
          .eq('user_id', userId);
          
        if (statusError) {
          console.error("Error deleting salon_user_status:", statusError);
          toast.error(`Kunde inte ta bort användarstatus: ${statusError.message}`);
        } else {
          console.log(`Successfully removed salon_user_status for user: ${userId}`);
        }
      }
      
      // Call the onConfirm callback that handles deletion of salon data
      onConfirm();
      handleClose();
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("Ett fel uppstod vid borttagning");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen && !isClosing} onOpenChange={(open) => !open && handleClose()}>
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
