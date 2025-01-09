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

interface DeleteSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  salonName?: string;
}

export const DeleteSalonDialog = ({
  isOpen,
  onClose,
  onConfirm,
  salonName,
}: DeleteSalonDialogProps) => {
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
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Ta bort</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};