
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DealForm } from "@/components/DealForm";
import { FormValues } from "@/components/deal-form/schema";

interface EditDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: FormValues;
}

export const EditDealDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditDealDialogProps) => {
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
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>
            {initialValues ? "Redigera erbjudande" : "Skapa erbjudande"}
          </DialogTitle>
          <DialogDescription>
            Fyll i informationen nedan för att {initialValues ? "uppdatera" : "skapa"} ett erbjudande
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 h-full overflow-y-auto">
          <DealForm onSubmit={onSubmit} initialValues={initialValues} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
