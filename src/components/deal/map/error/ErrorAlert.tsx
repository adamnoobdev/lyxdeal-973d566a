
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  errorMessage: string;
}

export const ErrorAlert = ({ errorMessage }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-sm text-red-800">
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
};
