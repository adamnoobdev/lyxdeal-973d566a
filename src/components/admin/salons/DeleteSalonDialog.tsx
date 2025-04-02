
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
import { useState } from "react";
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

  const handleDelete = async () => {
    if (!salonId) {
      onConfirm();
      return;
    }

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
      
      // Anropa onConfirm callback som hanterar borttagning av salongdata
      onConfirm();
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("Ett fel uppstod vid borttagning");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
          <AlertDialogDescription>
            Detta kommer permanent ta bort salongen{" "}
            {salonName && <strong>"{salonName}"</strong>}. Denna åtgärd kan inte
            ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Avbryt</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className={isDeleting ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isDeleting ? "Tar bort..." : "Ta bort"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
