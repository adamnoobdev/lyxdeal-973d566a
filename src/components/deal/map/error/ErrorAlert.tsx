
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorAlertProps {
  errorMessage: string;
}

export const ErrorAlert = ({ errorMessage }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-sm">
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
};
