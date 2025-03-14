
import { ErrorAlerts } from "./ErrorAlerts";
import { DiscountDialogHeader } from "./DialogHeader";
import { DiscountCodesTable } from "@/components/discount-codes/DiscountCodesTable";
import { Deal } from "@/components/admin/types";
import { useDiscountCodesDialog } from "./useDiscountCodesDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

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

  return (
    <>
      <DiscountDialogHeader
        title="Rabattkoder"
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
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 my-3 text-sm">
          <p className="font-medium text-amber-800">
            {inspectionResult.codesCount} rabattkoder hittades i databasen men visas inte här
          </p>
          <p className="text-amber-700 mt-1">
            Detta kan bero på en cachad vy eller att sidan behöver laddas om.
          </p>
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
        </div>
      )}
      
      <div className="flex-1 overflow-auto mt-4">
        <DiscountCodesTable 
          codes={discountCodes} 
          isLoading={isLoading || isFetching}
          emptyStateMessage={getEmptyStateMessage()}
          inspectionResult={inspectionResult}
        />
      </div>
    </>
  );
};
