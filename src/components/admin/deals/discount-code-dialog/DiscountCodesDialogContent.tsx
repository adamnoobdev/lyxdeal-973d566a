
import { ErrorAlerts } from "./ErrorAlerts";
import { DiscountDialogHeader } from "./DialogHeader";
import { DiscountCodesTable } from "@/components/discount-codes/DiscountCodesTable";
import { Deal } from "@/components/admin/types";
import { useDiscountCodesDialog } from "./useDiscountCodesDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Database, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DiscountCodesDialogContentProps {
  isOpen: boolean;
  deal: Deal | null;
  onGenerateDiscountCodes?: (quantity: number) => Promise<void>;
}

export const DiscountCodesDialogContent = ({ 
  isOpen, 
  deal,
  onGenerateDiscountCodes
}: DiscountCodesDialogContentProps) => {
  const {
    discountCodes,
    isLoading,
    isFetching,
    error,
    refreshAttempts,
    inspectionResult,
    timeElapsedText,
    isInspecting,
    handleManualRefresh,
    handleInspectCodes,
    getEmptyStateMessage
  } = useDiscountCodesDialog(isOpen, deal);

  // Visa om vi har hittat koder i inspektionen men de visas inte i UI
  const showCodeMismatchWarning = inspectionResult?.success && 
    inspectionResult?.codesCount > 0 && 
    discountCodes.length === 0;

  const dialogTitle = deal?.title 
    ? `Rabattkoder för ${deal.title}` 
    : "Rabattkoder";

  const elapsedTimeText = `Dialog öppnades för ${timeElapsedText}`;

  return (
    <>
      <DiscountDialogHeader
        title={dialogTitle}
        dealTitle={deal?.title}
        codesCount={discountCodes.length}
        isLoading={isLoading}
        isFetching={isFetching}
        timeElapsedText={timeElapsedText}
        onManualRefresh={handleManualRefresh}
        onInspectCodes={handleInspectCodes}
        isInspecting={isInspecting}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
      
      <ErrorAlerts
        error={error}
        refreshAttempts={refreshAttempts}
        codesLength={discountCodes.length}
        isLoading={isLoading}
        isFetching={isFetching}
        inspectionResult={inspectionResult}
      />
      
      {showCodeMismatchWarning && (
        <Alert variant="warning" className="bg-amber-50 border border-amber-200 my-3">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertDescription>
            <p className="font-medium text-amber-800">
              {inspectionResult.codesCount} rabattkoder hittades i databasen men visas inte här
            </p>
            <p className="text-amber-700 mt-1">
              Detta kan bero på att koder finns i databasen men med annat deal_id än {deal?.id}. Koder: {inspectionResult.sampleCodes?.map(c => c.code).join(', ')}
            </p>
            {inspectionResult.codeType && (
              <p className="text-amber-700 font-semibold mt-1">
                Din deal_id är lagrad som en {inspectionResult.codeType} istället för {typeof deal?.id}. Vi har uppdaterad koden för att hantera detta.
              </p>
            )}
            <div className="mt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1"
                onClick={handleManualRefresh}
                disabled={isFetching}
              >
                <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                <span>Uppdatera</span>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {inspectionResult && !inspectionResult.success && inspectionResult.dealIdTypes && (
        <Alert variant="default" className="bg-blue-50 border border-blue-200 my-3">
          <Database className="h-4 w-4 text-blue-800" />
          <AlertDescription>
            <p className="font-medium text-blue-800">
              Information om rabattkoder i databasen
            </p>
            <p className="text-blue-700 mt-1">
              Deal ID-typer i databasen: {inspectionResult.dealIdTypes.join(', ')}
            </p>
            <p className="text-blue-700">
              Ditt erbjudande ID ({deal?.id}) är av typen: {typeof deal?.id}
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 overflow-auto mt-4">
        <DiscountCodesTable 
          codes={discountCodes} 
          isLoading={isLoading || isFetching}
          emptyStateMessage={getEmptyStateMessage()}
          inspectionResult={inspectionResult}
          dealId={deal?.id}
          onGenerateDiscountCodes={onGenerateDiscountCodes && deal ? 
            () => onGenerateDiscountCodes(10) : undefined}
        />
      </div>
    </>
  );
};
