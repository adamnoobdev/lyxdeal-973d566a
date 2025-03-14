
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Database } from "lucide-react";

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
            Inga rabattkoder hittades efter flera försök. Använd inspektionsverktyget för att kontrollera om det finns koder i databasen.
          </AlertDescription>
        </Alert>
      )}
      
      {inspectionResult && (
        <Alert 
          variant={inspectionResult.success ? "default" : "warning"} 
          className="my-2"
        >
          <Database className="h-4 w-4" />
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
            {inspectionResult.tables && (
              <div className="mt-1 text-xs">
                <div>Databastabeller:</div>
                <ul className="list-disc pl-5">
                  {inspectionResult.tables.map((table: any, i: number) => (
                    <li key={i}>
                      {table.schema_name ? `${table.schema_name}.` : ''}{table.table_name || table.tablename} 
                      {table.row_count !== undefined ? ` (${table.row_count} rader)` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
