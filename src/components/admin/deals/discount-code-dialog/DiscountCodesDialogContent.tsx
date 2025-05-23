
import { ErrorAlerts } from "./ErrorAlerts";
import { DiscountDialogHeader } from "./DialogHeader";
import { DiscountCodesTable } from "@/components/discount-codes/DiscountCodesTable";
import { Deal } from "@/components/admin/types";
import { useDiscountCodesDialog } from "./useDiscountCodesDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, PlusCircle } from "lucide-react";
import { TestGenerateCodesButton } from "../TestGenerateCodesButton";
import { logIdInfo } from "@/utils/discount-codes/types";
import { Button } from "@/components/ui/button";

interface DiscountCodesDialogContentProps {
  isOpen: boolean;
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
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
    handleManualRefresh,
    handleInspectCodes,
    getEmptyStateMessage,
    isInspecting
  } = useDiscountCodesDialog(isOpen, deal);

  // Logga deal-information för felsökning
  if (deal) {
    logIdInfo("DiscountCodesDialogContent deal", deal.id);
  }

  // Visa om vi har hittat koder i inspektionen men de visas inte i UI
  const showCodeMismatchWarning = inspectionResult?.success && 
    inspectionResult?.codesCount > 0 && 
    discountCodes.length === 0;

  // Handlera generering av rabattkoder via användarinteraktion
  const handleGenerateDiscountCodes = async () => {
    if (deal && onGenerateDiscountCodes) {
      await onGenerateDiscountCodes(deal, 10);
      handleManualRefresh();
    }
    return Promise.resolve(); // Explicit Promise return to match expected type
  };

  return (
    <>
      <DiscountDialogHeader
        title={deal?.title || "Rabattkoder"}
        codesCount={discountCodes.length}
        isLoading={isLoading}
        isFetching={isFetching}
        timeElapsedText={timeElapsedText}
        onManualRefresh={handleManualRefresh}
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
          </AlertDescription>
        </Alert>
      )}
      
      {deal && discountCodes.length === 0 && !isLoading && !isFetching && (
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleGenerateDiscountCodes} 
              className="gap-2"
              disabled={isLoading || isFetching}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Generera 10 nya rabattkoder</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleInspectCodes}
              className="gap-2"
              disabled={isLoading || isFetching || isInspecting}
            >
              <AlertCircle className={`h-4 w-4 ${isInspecting ? "animate-spin" : ""}`} />
              <span>Inspektera databas</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Använd knapparna ovan för att generera nya koder eller inspektera existerande koder i databasen.
          </p>
          {deal && (
            <TestGenerateCodesButton 
              dealId={deal.id} 
              onSuccess={handleManualRefresh}
            />
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-auto mt-4">
        <DiscountCodesTable 
          codes={discountCodes} 
          isLoading={isLoading || isFetching}
          emptyStateMessage={getEmptyStateMessage()}
          inspectionResult={inspectionResult}
          dealId={deal?.id}
          onGenerateDiscountCodes={deal && onGenerateDiscountCodes ? handleGenerateDiscountCodes : undefined}
        />
      </div>
    </>
  );
};
