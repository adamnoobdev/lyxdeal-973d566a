
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Salonger</h1>
        <p className="text-gray-600 font-medium mt-1">
          Hantera salonger och deras erbjudanden
        </p>
      </div>
      <Button onClick={onCreateClick} className="whitespace-nowrap shadow-md bg-primary hover:bg-primary/90 transition-all">
        <Plus className="h-4 w-4 mr-2" />
        Skapa salong
      </Button>
    </div>
  );
};
