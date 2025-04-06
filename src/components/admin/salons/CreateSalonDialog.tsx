
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";
import { useState, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CreateSalonResponse {
  salon: any;
  temporaryPassword: string;
}

interface CreateSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<CreateSalonResponse | false>;
}

export const CreateSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateSalonDialogProps) => {
  const [password, setPassword] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isMountedRef = useRef(true);

  // Track mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Reset state when dialog opens with mount check
  useEffect(() => {
    if (isOpen && isMountedRef.current) {
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Safe state setter for component unmount protection
  const safeSetState = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  };

  const handleSubmit = async (values: any) => {
    if (isSubmitting) return;
    
    try {
      safeSetState(setIsSubmitting, true);
      console.log("Submitting salon creation values:", values);
      const response = await onSubmit(values);
      console.log("Response from salon creation:", response);
      
      if (response && response.temporaryPassword) {
        safeSetState(setPassword, response.temporaryPassword);
      } else if (response === false) {
        // Error was already handled in onSubmit
        return;
      } else {
        console.warn("No temporary password received from server");
        toast.error("Ett fel uppstod vid skapande av lösenord");
      }
    } catch (error) {
      console.error("Error creating salon:", error);
      toast.error("Ett fel uppstod vid skapande av salong");
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsSubmitting, false);
      }
    }
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success("Lösenord kopierat!");
    }
  };

  // Controlled close function to prevent UI freeze
  const handleClose = () => {
    if (isSubmitting) return;
    
    safeSetState(setIsClosing, true);
    setTimeout(() => {
      onClose();
      safeSetState(setPassword, null);
      
      setTimeout(() => {
        if (isMountedRef.current) {
          safeSetState(setIsClosing, false);
        }
      }, 100);
    }, 200);
  };

  return (
    <Dialog open={isOpen && !isClosing} onOpenChange={(open) => !open && handleClose()}>
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
          <SalonForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </DialogContent>
    </Dialog>
  );
};
