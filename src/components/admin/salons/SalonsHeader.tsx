import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SalonsHeaderProps {
  error: Error | null;
  onCreateClick: () => void;
}

export const SalonsHeader = ({ error, onCreateClick }: SalonsHeaderProps) => {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "Ett fel uppstod när salonger skulle hämtas"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Salonger</h1>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Skapa salong
      </Button>
    </div>
  );
};