
import { useCallback } from "react";
import { FormValues } from "@/components/deal-form/schema";
import { useDealsAdmin } from "@/hooks/useDealsAdmin";
import { useDealsDialogs } from "@/hooks/useDealsDialogs";
import { useOperationExclusion } from "@/hooks/useOperationExclusion";
import { DealsLoadingSkeleton } from "./DealsLoadingSkeleton";
import { PendingDealsSection } from "./PendingDealsSection";
import { DealsTabsSection } from "./DealsTabsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DealsDialogs } from "./DealsDialogs";
import { usePendingDealsFunctions } from "./PendingDealsFunctions";
import { DealsHeader } from "./DealsHeader";

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

  const { runExclusiveOperation } = useOperationExclusion();
  const { handleStatusChange } = usePendingDealsFunctions(refetch);

  const onDelete = useCallback(async () => {
    if (!deletingDeal || isDeletingDealRef.current) return;

    await runExclusiveOperation(async () => {
      try {
        isDeletingDealRef.current = true;
        console.log("Starting deal deletion for ID:", deletingDeal.id);
        const success = await handleDelete(deletingDeal.id);
        
        if (success) {
          console.log("Deal deletion successful");
          handleCloseDialogs();
        }
        return success;
      } catch (error) {
        console.error("Error in deal deletion flow:", error);
        return false;
      } finally {
        isDeletingDealRef.current = false;
      }
    });
  }, [deletingDeal, handleDelete, isDeletingDealRef, runExclusiveOperation, handleCloseDialogs]);

  const onUpdate = useCallback(async (values: FormValues) => {
    if (!editingDeal || isUpdatingDealRef.current) return;
    
    await runExclusiveOperation(async () => {
      try {
        isUpdatingDealRef.current = true;
        console.log("Starting deal update for ID:", editingDeal.id);
        const success = await handleUpdate(values, editingDeal.id);
        
        if (success) {
          console.log("Deal update successful");
          handleCloseDialogs();
        }
        return success;
      } catch (error) {
        console.error("Error in deal update flow:", error);
        return false;
      } finally {
        isUpdatingDealRef.current = false;
      }
    });
  }, [editingDeal, handleUpdate, isUpdatingDealRef, runExclusiveOperation, handleCloseDialogs]);

  const onCreate = useCallback(async (values: FormValues) => {
    if (isUpdatingDealRef.current) return;
    
    await runExclusiveOperation(async () => {
      try {
        isUpdatingDealRef.current = true;
        console.log("Starting deal creation");
        const success = await handleCreate(values);
        
        if (success) {
          console.log("Deal creation successful");
          handleCloseDialogs();
        }
        return success;
      } catch (error) {
        console.error("Error in deal creation flow:", error);
        return false;
      } finally {
        isUpdatingDealRef.current = false;
      }
    });
  }, [handleCreate, isUpdatingDealRef, runExclusiveOperation, handleCloseDialogs]);

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error instanceof Error ? error.message : "Ett fel uppstod när erbjudanden skulle hämtas"}
      </AlertDescription>
    </Alert>
  );

  const pendingDeals = deals?.filter(deal => deal.status === 'pending') || [];

  return (
    <div className="space-y-6">
      <DealsHeader onCreateClick={handleCreateDeal} />

      <div className="space-y-6">
        {pendingDeals.length > 0 && (
          <PendingDealsSection 
            pendingDeals={pendingDeals}
            setEditingDeal={handleEditDeal}
            setDeletingDeal={handleDeleteDeal}
            handleToggleActive={handleToggleActive}
            handleStatusChange={handleStatusChange}
          />
        )}

        <DealsTabsSection 
          activeDeals={activeDeals}
          inactiveDeals={inactiveDeals}
          setEditingDeal={handleEditDeal}
          setDeletingDeal={handleDeleteDeal}
          handleToggleActive={handleToggleActive}
        />
      </div>

      <DealsDialogs 
        editingDeal={editingDeal}
        deletingDeal={deletingDeal}
        isCreating={isCreating}
        onClose={handleCloseDialogs}
        onUpdate={onUpdate}
        onCreate={onCreate}
        onDelete={onDelete}
      />
    </div>
  );
};
