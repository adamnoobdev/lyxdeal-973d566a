
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeAllDiscountCodes } from "@/utils/discountCodeUtils";
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

interface RemoveAllCodesButtonProps {
  onSuccess?: () => void;
}

export const RemoveAllCodesButton = ({ onSuccess }: RemoveAllCodesButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveAllCodes = async () => {
    setIsRemoving(true);
    try {
      const success = await removeAllDiscountCodes();
      if (success) {
        toast.success("Alla rabattkoder har tagits bort");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Kunde inte ta bort alla rabattkoder");
      }
    } catch (error) {
      console.error("[RemoveAllCodesButton] Error removing all codes:", error);
      toast.error("Ett fel uppstod när rabattkoder skulle tas bort");
    } finally {
      setIsRemoving(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        <span>Ta bort alla rabattkoder</span>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta bort alla rabattkoder</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att ta bort ALLA rabattkoder från databasen. 
              Denna åtgärd kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemoving}
              onClick={(e) => {
                e.preventDefault();
                handleRemoveAllCodes();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? "Tar bort..." : "Ta bort alla"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
