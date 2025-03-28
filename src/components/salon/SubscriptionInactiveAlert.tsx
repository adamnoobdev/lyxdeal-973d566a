
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface SubscriptionInactiveAlertProps {
  onReactivate: () => void;
}

export function SubscriptionInactiveAlert({
  onReactivate,
}: SubscriptionInactiveAlertProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Inaktiv prenumeration</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          Din prenumeration är pausad. Du kan fortfarande se dina uppgifter, men
          kan inte skapa eller hantera erbjudanden.
        </div>
        <Button
          onClick={onReactivate}
          variant="outline"
          className="bg-white hover:bg-white/90 border-white"
          size="sm"
        >
          Återaktivera nu
        </Button>
      </AlertDescription>
    </Alert>
  );
}
