import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";

interface EditSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
}

export const EditSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditSalonDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Redigera salong</DialogTitle>
        </DialogHeader>
        <SalonForm onSubmit={onSubmit} initialValues={initialValues} />
      </DialogContent>
    </Dialog>
  );
};