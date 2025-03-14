
import { ErrorAlerts } from "./ErrorAlerts";
import { DialogHeader } from "./DialogHeader";
import { DiscountCodesTable } from "@/components/discount-codes/DiscountCodesTable";
import { Deal } from "@/components/admin/types";
import { useDiscountCodesDialog } from "./useDiscountCodesDialog";

interface DiscountCodesDialogContentProps {
  isOpen: boolean;
  deal: Deal | null;
}

export const DiscountCodesDialogContent = ({ 
  isOpen, 
  deal 
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

  return (
    <>
      <DialogHeader
        title="Rabattkoder"
        dealTitle={deal?.title}
        codesCount={discountCodes.length}
        isLoading={isLoading}
        isFetching={isFetching}
        timeElapsedText={timeElapsedText}
        onManualRefresh={handleManualRefresh}
        onInspectCodes={handleInspectCodes}
        isInspecting={isInspecting}
      />
      
      <ErrorAlerts
        error={error}
        refreshAttempts={refreshAttempts}
        codesLength={discountCodes.length}
        isLoading={isLoading}
        isFetching={isFetching}
        inspectionResult={inspectionResult}
      />
      
      <div className="flex-1 overflow-auto mt-4">
        <DiscountCodesTable 
          codes={discountCodes} 
          isLoading={isLoading || isFetching}
          emptyStateMessage={getEmptyStateMessage()}
        />
      </div>
    </>
  );
};
