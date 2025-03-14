
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface ErrorAlertsProps {
  error: any;
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
  return (
    <>
      {error && (
        <Alert variant="destructive" className="my-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Det uppstod ett fel när rabattkoderna skulle hämtas. Försök igen senare.
          </AlertDescription>
        </Alert>
      )}
      
      {codesLength === 0 && refreshAttempts >= 5 && !isLoading && !isFetching && (
        <Alert variant="warning" className="my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vi har inte hittat några rabattkoder efter flera försök. Det kan bero på att genereringen misslyckades eller att det finns en fördröjning. 
            Prova att uppdatera sidan eller generera nya rabattkoder för erbjudandet.
          </AlertDescription>
        </Alert>
      )}
      
      {inspectionResult && (
        <Alert 
          variant={inspectionResult.success ? "default" : "warning"} 
          className="my-2"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <strong>Databasinspektion:</strong> {inspectionResult.message}
            </div>
            {inspectionResult.success && inspectionResult.sampleCodes && (
              <div className="mt-1 text-xs font-mono">
                <div>Exempel på koder i databasen:</div>
                <ul className="list-disc pl-5">
                  {inspectionResult.sampleCodes.map((code: any, i: number) => (
                    <li key={i}>
                      {code.code} ({code.isUsed ? 'använd' : 'oanvänd'})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!inspectionResult.success && inspectionResult.codesFoundForDeals && (
              <div className="mt-1 text-xs">
                Hittade koder för andra erbjudanden med ID: {inspectionResult.codesFoundForDeals.join(', ')}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
