
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorAlertsProps {
  error: Error | null;
  refreshAttempts: number;
  codesLength: number;
  isLoading: boolean;
  isFetching: boolean;
  inspectionResult: any;
}

export const ErrorAlerts = ({
  error,
  refreshAttempts,
  codesLength,
  isLoading,
  isFetching,
  inspectionResult
}: ErrorAlertsProps) => {
  // Visa inte fel om vi håller på att ladda eller hämta data
  if (isLoading || isFetching) return null;
  
  // Visa felmeddelande från huvudförfrågan
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "Ett fel uppstod när rabattkoder skulle hämtas"}
        </AlertDescription>
      </Alert>
    );
  }
  
  // Visa felmeddelande för inspektionsfel
  if (inspectionResult?.error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {inspectionResult.message || "Ett fel uppstod under inspektion av rabattkoder"}
        </AlertDescription>
      </Alert>
    );
  }

  // Visa varning om vi har försökt flera gånger men inte hittat några koder
  if (refreshAttempts >= 5 && codesLength === 0) {
    return (
      <Alert variant="warning" className="mb-4 bg-amber-50 border border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-800" />
        <AlertDescription className="text-amber-800">
          Vi kunde inte hitta några rabattkoder efter flera försök. Du kan prova att:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Generera nya rabattkoder</li>
            <li>Använda inspektionstjänsten för att kontrollera databassituationen</li>
            <li>Försöka uppdatera listan igen</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
