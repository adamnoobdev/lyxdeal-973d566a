import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";

interface CreateSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export const CreateSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateSalonDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Skapa ny salong</DialogTitle>
          <DialogDescription>
            När du skapar en ny salong kommer ett temporärt lösenord att genereras. 
            Detta lösenord kommer att visas en gång efter att salongen skapats.
          </DialogDescription>
        </DialogHeader>
        <SalonForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};