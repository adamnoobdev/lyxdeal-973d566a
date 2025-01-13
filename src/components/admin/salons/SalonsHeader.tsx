import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SalonsHeaderProps {
  error: Error | string | null;
  onCreateClick: () => void;
}

export const SalonsHeader = ({ error, onCreateClick }: SalonsHeaderProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Salonger</h1>
        <p className="text-muted-foreground mt-1">
          Hantera salonger och deras erbjudanden
        </p>
      </div>
      <Button onClick={onCreateClick} size="sm" className="whitespace-nowrap">
        <Plus className="h-4 w-4 mr-2" />
        Skapa salong
      </Button>
    </div>
  );
};