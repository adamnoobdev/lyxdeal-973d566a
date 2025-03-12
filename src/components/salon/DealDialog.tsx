
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: FormValues;
}

export const DealDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: DealDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Ensure we properly cleanup when closing
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Redigera Erbjudande" : "Skapa Erbjudande"}
          </DialogTitle>
        </DialogHeader>
        <DealForm onSubmit={onSubmit} initialValues={initialValues} />
      </DialogContent>
    </Dialog>
  );
};
