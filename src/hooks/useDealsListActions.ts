
import { useCallback, useRef, useState } from "react";
import { FormValues } from "@/components/deal-form/schema";
import { Deal } from "@/components/admin/types";
import { useOperationExclusion } from "@/hooks/useOperationExclusion";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { createDeal, updateDeal, deleteDeal } from "@/utils/deal/queries";

/**
 * Hook containing action handlers for the deals list
 */
export const useDealsListActions = (
  refetch: () => Promise<unknown>
) => {
  const { runExclusiveOperation } = useOperationExclusion();
  const isUpdatingDealRef = useRef(false);
  const isDeletingDealRef = useRef(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  const onDelete = useCallback(async (deletingDeal: Deal | null): Promise<void> => {
    if (!deletingDeal || isDeletingDealRef.current) {
      console.log("[DealsListActions] Delete aborted: No deal selected or deletion in progress");
      return;
    }

    try {
      isDeletingDealRef.current = true;
      console.log("[DealsListActions] Starting deal deletion for ID:", deletingDeal.id);
      
      const success = await deleteDeal(deletingDeal.id);
      
      if (success) {
        console.log("[DealsListActions] Deal deletion successful");
        // Wait a longer moment before refetching to ensure server state has updated
        setTimeout(async () => {
          if (refetch) {
            await refetch();
          }
          // Reset deletion state after refetch completes
          setTimeout(() => {
            isDeletingDealRef.current = false;
          }, 300);
        }, 500);
      } else {
        console.error("[DealsListActions] Deal deletion failed");
        isDeletingDealRef.current = false;
      }
    } catch (error) {
      console.error("[DealsListActions] Error in deal deletion flow:", error);
      isDeletingDealRef.current = false;
    }
  }, [refetch]);

  const onUpdate = useCallback(async (values: FormValues, editingDeal: Deal | null) => {
    if (!editingDeal || isUpdatingDealRef.current) return;
    
    await runExclusiveOperation(async () => {
      try {
        isUpdatingDealRef.current = true;
        console.log("[DealsListActions] Starting deal update for ID:", editingDeal.id);
        const success = await updateDeal(values, editingDeal.id);
        
        if (success) {
          console.log("[DealsListActions] Deal update successful");
          await refetch();
          return success;
        }
        return false;
      } catch (error) {
        console.error("[DealsListActions] Error in deal update flow:", error);
        return false;
      } finally {
        setTimeout(() => {
          isUpdatingDealRef.current = false;
        }, 300);
      }
    });
  }, [runExclusiveOperation, refetch]);

  const onCreate = useCallback(async (
    values: FormValues, 
    setDealCreationState: (state: { 
      timestamp: number | null, 
      attempts: number,
      justCreatedDeal: Deal | null 
    }) => void
  ) => {
    if (isUpdatingDealRef.current) return;
    
    await runExclusiveOperation(async () => {
      try {
        isUpdatingDealRef.current = true;
        console.log("[DealsListActions] Starting deal creation");
        
        // Set creation state for tracking the newly created deal
        setDealCreationState({
          timestamp: Date.now(),
          attempts: 0,
          justCreatedDeal: null
        });
        
        const success = await createDeal(values);
        
        if (success) {
          console.log("[DealsListActions] Deal creation successful");
          
          toast.success("Erbjudandet har skapats!", {
            description: "Rabattkoder kommer visas automatiskt när de har genererats."
          });
          
          setTimeout(() => {
            refetch();
          }, 1000);
          
          return success;
        } else {
          setDealCreationState({
            timestamp: null,
            attempts: 0,
            justCreatedDeal: null
          });
          toast.error("Ett fel uppstod när erbjudandet skulle skapas");
          return false;
        }
      } catch (error) {
        console.error("[DealsListActions] Error in deal creation flow:", error);
        setDealCreationState({
          timestamp: null,
          attempts: 0,
          justCreatedDeal: null
        });
        return false;
      } finally {
        setTimeout(() => {
          isUpdatingDealRef.current = false;
        }, 600);
      }
    });
  }, [runExclusiveOperation, refetch]);

  const handleGenerateDiscountCodes = useCallback(async (deal: Deal, quantity: number = 10) => {
    if (isGeneratingCodes) return;
    
    try {
      setIsGeneratingCodes(true);
      console.log(`[DealsListActions] Manually generating ${quantity} discount codes for deal ID ${deal.id}`);
      
      toast.promise(
        generateDiscountCodes(deal.id, quantity),
        {
          loading: `Genererar ${quantity} rabattkoder...`,
          success: (success) => {
            if (success) {
              console.log(`[DealsListActions] Successfully generated ${quantity} codes for deal ID ${deal.id}`);
              setTimeout(() => refetch(), 1000);
              return `${quantity} rabattkoder har genererats för "${deal.title}"`;
            } else {
              console.error(`[DealsListActions] Failed to generate codes for deal ID ${deal.id}`);
              return "Kunde inte generera alla rabattkoder, försök igen senare";
            }
          },
          error: (err) => {
            console.error('[DealsListActions] Error generating discount codes:', err);
            return 'Ett fel uppstod när rabattkoder skulle genereras';
          }
        }
      );
    } catch (error) {
      console.error('[DealsListActions] Error generating discount codes:', error);
      toast.error('Ett fel uppstod när rabattkoder skulle genereras');
    } finally {
      setTimeout(() => {
        setIsGeneratingCodes(false);
      }, 1000);
    }
  }, [isGeneratingCodes, refetch]);

  return {
    onDelete,
    onUpdate,
    onCreate,
    handleGenerateDiscountCodes,
    isGeneratingCodes,
    isUpdatingDealRef,
    isDeletingDealRef
  };
};
