
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
import { useNewDealTracking } from "@/hooks/useNewDealTracking";
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

  const { handleStatusChange } = usePendingDealsFunctions(refetch);

  // Set up discount codes dialog manager
  const {
    discountCodesDialog,
    handleViewDiscountCodes
  } = DiscountCodesDialogManager({
    onGenerateDiscountCodes: handleGenerateDiscountCodes,
    justCreatedDeal,
    resetJustCreatedDeal: resetDealCreationState
  });

  // Effect to show discount codes for newly created deals
  useEffect(() => {
    if (justCreatedDeal && !isCreating && !editingDeal && !deletingDeal) {
      console.log("[DealsListContainer] New deal created, displaying discount codes dialog");
    }
  }, [justCreatedDeal, isCreating, editingDeal, deletingDeal]);

  // Wrapper functions that connect to the action hooks
  const handleDeleteSubmit = () => onDelete(deletingDeal);
  const handleUpdateSubmit = (values) => onUpdate(values, editingDeal);
  const handleCreateSubmit = (values) => onCreate(values, setDealCreationState);

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) return (
    <Alert variant="destructive" className="mx-4 sm:mx-0">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error instanceof Error ? error.message : "Ett fel uppstod när erbjudanden skulle hämtas"}
      </AlertDescription>
    </Alert>
  );

  const pendingDeals = deals?.filter(deal => deal.status === 'pending') || [];

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
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

      {discountCodesDialog}
    </div>
  );
};
