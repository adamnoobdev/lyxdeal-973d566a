
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Ett fel uppstod</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
