
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
  isSubmitting?: boolean;
}

export const DeleteDealDialog = ({
  isOpen,
  onClose,
  onConfirm,
  dealTitle,
  isSubmitting = false,
}: DeleteDealDialogProps) => {
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ta bort erbjudande</AlertDialogTitle>
          <AlertDialogDescription>
            Är du säker på att du vill ta bort erbjudandet
            <span className="font-semibold"> {dealTitle}</span>? Detta kan inte
            ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Avbryt</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-destructive hover:bg-destructive/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Tar bort..." : "Ta bort"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
