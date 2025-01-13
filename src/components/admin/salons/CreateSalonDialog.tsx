import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

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
  const [password, setPassword] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    try {
      const response = await onSubmit(values);
      if (response?.temporaryPassword) {
        setPassword(response.temporaryPassword);
      }
    } catch (error) {
      console.error("Error creating salon:", error);
    }
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success("Lösenord kopierat!");
    }
  };

  const handleClose = () => {
    setPassword(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Skapa ny salong</DialogTitle>
          <DialogDescription>
            När du skapar en ny salong kommer ett temporärt lösenord att genereras. 
            Detta lösenord kommer att visas här efter att salongen skapats.
          </DialogDescription>
        </DialogHeader>

        {password ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="space-y-4">
                <p>Salongen har skapats! Här är det temporära lösenordet:</p>
                <div className="flex items-center gap-2 bg-secondary p-2 rounded">
                  <code className="text-lg font-mono">{password}</code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyPassword}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Se till att spara detta lösenord på ett säkert ställe. Det kommer inte att visas igen.
                </p>
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Stäng</Button>
            </div>
          </div>
        ) : (
          <SalonForm onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
};