
import { useEffect } from "react";
import { useDealsAdmin } from "@/hooks/useDealsAdmin";
import { useDealsDialogs } from "@/hooks/useDealsDialogs";
import { DealsLoadingSkeleton } from "./DealsLoadingSkeleton";
import { PendingDealsSection } from "./PendingDealsSection";
import { DealsTabsSection } from "./DealsTabsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DealsDialogs } from "./DealsDialogs";
import { usePendingDealsFunctions } from "./PendingDealsFunctions";
import { DealsHeader } from "./DealsHeader";
import { useDealsListActions } from "@/hooks/useDealsListActions";
import { useNewDealTracking, DealCreationState } from "@/hooks/useNewDealTracking";
import { DiscountCodesDialogManager } from "./discount-codes/DiscountCodesDialogManager";

export const DealsListContainer = () => {
  const {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
    handleCreate,
    handleToggleActive,
    refetch
  } = useDealsAdmin();

  const {
    editingDeal,
    deletingDeal,
    isCreating,
    isUpdatingDealRef,
    isDeletingDealRef,
    handleEditDeal,
    handleDeleteDeal,
    handleCreateDeal,
    handleCloseDialogs
  } = useDealsDialogs();

  const {
    dealCreationState,
    setDealCreationState,
    resetDealCreationState,
    justCreatedDeal
  } = useNewDealTracking(refetch);

  const {
    onDelete,
    onUpdate,
    onCreate,
    handleGenerateDiscountCodes,
    isGeneratingCodes
  } = useDealsListActions(refetch);

  const { handleStatusChange, RejectionDialog } = usePendingDealsFunctions(refetch);

  const {
    discountCodesDialog,
    handleViewDiscountCodes
  } = DiscountCodesDialogManager({
    onGenerateDiscountCodes: handleGenerateDiscountCodes,
    justCreatedDeal,
    resetJustCreatedDeal: resetDealCreationState
  });

  useEffect(() => {
    if (justCreatedDeal && !isCreating && !editingDeal && !deletingDeal) {
      console.log("[DealsListContainer] New deal created, displaying discount codes dialog");
    }
  }, [justCreatedDeal, isCreating, editingDeal, deletingDeal]);

  const handleDeleteSubmit = async () => {
    // Only trigger delete when there's a deal to delete and not already deleting
    if (deletingDeal && !isDeletingDealRef.current) {
      try {
        console.log("[DealsListContainer] Triggering delete for deal:", deletingDeal.id);
        await onDelete(deletingDeal);
        // Delete dialog closed automatically by the DeleteDealDialog component
      } catch (error) {
        console.error("[DealsListContainer] Error during delete:", error);
      }
    } else {
      console.log("[DealsListContainer] No deal to delete or deletion already in progress");
    }
  };
  
  const handleUpdateSubmit = (values) => onUpdate(values, editingDeal);
  
  const handleCreateSubmit = (values) => onCreate(values, (newState: DealCreationState) => {
    setDealCreationState(newState);
  });

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) return (
    <Alert variant="destructive" className="mx-2 xs:mx-4 sm:mx-0">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-xs xs:text-sm">
        {error instanceof Error ? error.message : "Ett fel uppstod när erbjudanden skulle hämtas"}
      </AlertDescription>
    </Alert>
  );

  const pendingDeals = deals?.filter(deal => deal.status === 'pending') || [];

  return (
    <div className="space-y-4 sm:space-y-6 px-2 xs:px-4 sm:px-0">
      <DealsHeader onCreateClick={handleCreateDeal} />

      <div className="space-y-4 sm:space-y-6">
        {pendingDeals.length > 0 && (
          <PendingDealsSection 
            pendingDeals={pendingDeals}
            setEditingDeal={handleEditDeal}
            setDeletingDeal={handleDeleteDeal}
            handleToggleActive={handleToggleActive}
            handleStatusChange={handleStatusChange}
            onViewDiscountCodes={handleViewDiscountCodes}
          />
        )}

        <DealsTabsSection 
          activeDeals={activeDeals}
          inactiveDeals={inactiveDeals}
          setEditingDeal={handleEditDeal}
          setDeletingDeal={handleDeleteDeal}
          handleToggleActive={handleToggleActive}
          onViewDiscountCodes={handleViewDiscountCodes}
          onGenerateDiscountCodes={handleGenerateDiscountCodes}
          isGeneratingCodes={isGeneratingCodes}
        />
      </div>

      <DealsDialogs 
        editingDeal={editingDeal}
        deletingDeal={deletingDeal}
        isCreating={isCreating}
        onClose={handleCloseDialogs}
        onUpdate={handleUpdateSubmit}
        onCreate={handleCreateSubmit}
        onDelete={handleDeleteSubmit}
      />

      <RejectionDialog />
      {discountCodesDialog}
    </div>
  );
};
