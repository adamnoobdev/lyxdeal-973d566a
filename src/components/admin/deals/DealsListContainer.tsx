
import { useCallback, useState, useRef, useEffect } from "react";
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
import { DiscountCodesDialog } from "./DiscountCodesDialog";
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const { runExclusiveOperation } = useOperationExclusion();
  const { handleStatusChange } = usePendingDealsFunctions(refetch);
  const [isViewingCodes, setIsViewingCodes] = useState(false);

  const lastCreatedDealId = useRef<number | null>(null);
  const justCreatedDeal = useRef<Deal | null>(null);
  const dealCreationTimestamp = useRef<number | null>(null);

  // This effect automatically shows the discount codes dialog after a new deal is created
  useEffect(() => {
    if (justCreatedDeal.current && !isCreating && !editingDeal && !deletingDeal && !viewingCodesForDeal) {
      console.log("[DealsListContainer] New deal created, scheduling discount codes dialog to open");
      
      // Add a delay to ensure database operations complete
      const timer = setTimeout(() => {
        console.log("[DealsListContainer] Opening discount codes dialog for newly created deal:", justCreatedDeal.current?.title);
        setViewingCodesForDeal(justCreatedDeal.current);
        justCreatedDeal.current = null;
        dealCreationTimestamp.current = null;
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isCreating, editingDeal, deletingDeal, viewingCodesForDeal]);

  // This effect attempts to find and fetch new deal info for showing discount codes
  useEffect(() => {
    const findNewlyCreatedDeal = async () => {
      // If we have a timestamp when deal was created, try to find it
      if (dealCreationTimestamp.current && !justCreatedDeal.current && !isCreating && !editingDeal) {
        try {
          console.log("[DealsListContainer] Attempting to find newly created deal");
          
          // Query deals created after our timestamp
          const creationTime = new Date(dealCreationTimestamp.current).toISOString();
          const { data: newDeals, error } = await supabase
            .from('deals')
            .select('*')
            .gte('created_at', creationTime)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (error) {
            console.error("[DealsListContainer] Error finding new deal:", error);
          } else if (newDeals && newDeals.length > 0) {
            console.log("[DealsListContainer] Found newly created deal:", newDeals[0]);
            justCreatedDeal.current = newDeals[0] as Deal;
          } else {
            console.log("[DealsListContainer] No newly created deals found");
          }
        } catch (error) {
          console.error("[DealsListContainer] Exception finding new deal:", error);
        }
      }
    };
    
    // Run once when component mounts or when isCreating changes
    findNewlyCreatedDeal();
  }, [isCreating, editingDeal]);

  const onDelete = useCallback(async () => {
    if (!deletingDeal || isDeletingDealRef.current) return;

    await runExclusiveOperation(async () => {
      try {
        isDeletingDealRef.current = true;
        console.log("[DealsListContainer] Starting deal deletion for ID:", deletingDeal.id);
        const success = await handleDelete(deletingDeal.id);
        
        if (success) {
          console.log("[DealsListContainer] Deal deletion successful");
          handleCloseDialogs();
        }
        return success;
      } catch (error) {
        console.error("[DealsListContainer] Error in deal deletion flow:", error);
        return false;
      } finally {
        setTimeout(() => {
          isDeletingDealRef.current = false;
        }, 300);
      }
    });
  }, [deletingDeal, handleDelete, isDeletingDealRef, runExclusiveOperation, handleCloseDialogs]);

  const onUpdate = useCallback(async (values: FormValues) => {
    if (!editingDeal || isUpdatingDealRef.current) return;
    
    await runExclusiveOperation(async () => {
      try {
        isUpdatingDealRef.current = true;
        console.log("[DealsListContainer] Starting deal update for ID:", editingDeal.id);
        const success = await handleUpdate(values, editingDeal.id);
        
        if (success) {
          console.log("[DealsListContainer] Deal update successful");
          setTimeout(() => {
            handleCloseDialogs();
          }, 300);
        }
        return success;
      } catch (error) {
        console.error("[DealsListContainer] Error in deal update flow:", error);
        return false;
      } finally {
        setTimeout(() => {
          isUpdatingDealRef.current = false;
        }, 300);
      }
    });
  }, [editingDeal, handleUpdate, isUpdatingDealRef, runExclusiveOperation, handleCloseDialogs]);

  const onCreate = useCallback(async (values: FormValues) => {
    if (isUpdatingDealRef.current) return;
    
    await runExclusiveOperation(async () => {
      try {
        isUpdatingDealRef.current = true;
        console.log("[DealsListContainer] Starting deal creation");
        
        // Store timestamp before creation
        dealCreationTimestamp.current = Date.now();
        
        const success = await handleCreate(values);
        
        if (success) {
          console.log("[DealsListContainer] Deal creation successful, timestamp:", dealCreationTimestamp.current);
          
          // Attempt to find the newly created deal
          setTimeout(async () => {
            try {
              console.log("[DealsListContainer] Fetching newly created deal");
              const { data: newDeals } = await supabase
                .from('deals')
                .select('*')
                .eq('salon_id', values.salon_id)
                .order('created_at', { ascending: false })
                .limit(1);
                
              if (newDeals && newDeals.length > 0) {
                console.log("[DealsListContainer] Found newly created deal:", newDeals[0]);
                justCreatedDeal.current = newDeals[0] as Deal;
                
                // Wait a bit longer to ensure discount codes are generated
                setTimeout(() => {
                  refetch();
                }, 1000);
              }
              
              handleCloseDialogs();
              toast.success("Erbjudandet har skapats! Rabattkoder kommer visas automatiskt.");
            } catch (error) {
              console.error("[DealsListContainer] Error fetching new deal:", error);
              handleCloseDialogs();
            }
          }, 1000);
        } else {
          dealCreationTimestamp.current = null;
        }
        
        return success;
      } catch (error) {
        console.error("[DealsListContainer] Error in deal creation flow:", error);
        dealCreationTimestamp.current = null;
        return false;
      } finally {
        setTimeout(() => {
          isUpdatingDealRef.current = false;
        }, 600);
      }
    });
  }, [handleCreate, isUpdatingDealRef, runExclusiveOperation, handleCloseDialogs, refetch]);

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    console.log("[DealsListContainer] Viewing discount codes for deal:", deal);
    setIsViewingCodes(true);
    setViewingCodesForDeal(deal);
  }, []);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    setIsClosingCodesDialog(true);
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
      setIsViewingCodes(false);
    }, 300);
  }, []);

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

      <DiscountCodesDialog
        isOpen={!!viewingCodesForDeal && !isClosingCodesDialog}
        onClose={handleCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
      />
    </div>
  );
};
