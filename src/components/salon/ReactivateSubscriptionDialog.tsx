
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ReactivateSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string | null;
  onSuccess: () => void;
}

export function ReactivateSubscriptionDialog({
  isOpen,
  onClose,
  subscriptionId,
  onSuccess,
}: ReactivateSubscriptionDialogProps) {
  const [isReactivating, setIsReactivating] = useState(false);
  const { toast } = useToast();

  const handleReactivate = async () => {
    if (!subscriptionId) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta prenumerationsinformation",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsReactivating(true);

      const { data, error } = await supabase.functions.invoke(
        "reactivate-subscription",
        {
          body: {
            subscription_id: subscriptionId,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Kunde inte återaktivera prenumerationen");
      }

      toast({
        title: "Prenumeration återaktiverad",
        description: "Din prenumeration har återaktiverats!",
        variant: "default",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Fel vid återaktivering:", err);
      toast({
        title: "Fel vid återaktivering",
        description:
          err instanceof Error
            ? err.message
            : "Ett fel uppstod vid återaktivering",
        variant: "destructive",
      });
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Återaktivera prenumeration</DialogTitle>
          <DialogDescription>
            Din prenumeration är för närvarande pausad, vilket betyder att ditt
            konto har begränsad funktionalitet. Återaktivera för att få tillgång
            till alla funktioner igen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">När du återaktiverar:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Du kan skapa och hantera erbjudanden igen</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Dina erbjudanden kommer att kunna aktiveras igen</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Du får tillgång till alla plattformens funktioner</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <XCircle className="mr-2 h-4 w-4" />
            Avbryt
          </Button>
          <LoadingButton
            onClick={handleReactivate}
            loading={isReactivating}
            disabled={isReactivating}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Återaktivera
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
