
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ett fel uppstod</AlertTitle>
      <AlertDescription className="mb-2">
        Det gick inte att hämta samarbetsförfrågningar. {error.message}
      </AlertDescription>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry} 
        className="mt-2 bg-background/80"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Försök igen
      </Button>
    </Alert>
  );
}
