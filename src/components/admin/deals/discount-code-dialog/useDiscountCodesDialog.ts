
import { useState, useEffect, useCallback, useRef } from "react";
import { useDiscountCodes } from "@/hooks/useDiscountCodes";
import { inspectDiscountCodes } from "@/utils/discountCodeUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";

export const useDiscountCodesDialog = (isOpen: boolean, deal: Deal | null) => {
  const { discountCodes, isLoading, error, refetch, isFetching } = useDiscountCodes(isOpen ? deal?.id : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [isManuallyTriggeredFetch, setIsManuallyTriggeredFetch] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [dialogOpenedAt, setDialogOpenedAt] = useState<Date | null>(null);

  // Reset internal state when dialog opens/closes and trigger refetch when dialog opens
  useEffect(() => {
    if (isOpen && deal?.id) {
      const now = new Date();
      console.log(`[DiscountCodesDialog] 🟢 Dialog opened at ${now.toISOString()} for deal ID: ${deal.id}, triggering refetch`);
      setDialogOpenedAt(now);
      setIsLoaded(true);
      setRefreshAttempts(0);
      setManualRefreshCount(0);
      setIsManuallyTriggeredFetch(false);
      setInspectionResult(null);
      
      // Force a refetch when the dialog opens to get fresh data
      refetch({ cancelRefetch: false })
        .then(result => {
          console.log(`[DiscountCodesDialog] ✓ Initial refetch completed with ${result.data?.length || 0} codes`);
        })
        .catch(err => {
          console.error(`[DiscountCodesDialog] ❌ Error during initial refetch:`, err);
        });
    } else if (!isOpen) {
      console.log("[DiscountCodesDialog] Dialog closed or no deal selected");
      setDialogOpenedAt(null);
    }
  }, [isOpen, deal?.id, refetch]);

  // Automatically retry fetching if no codes are found on first load
  useEffect(() => {
    if (isOpen && deal?.id && isLoaded && discountCodes.length === 0 && !isLoading && !isFetching && refreshAttempts < 8) {
      const timer = setTimeout(() => {
        console.log(`[DiscountCodesDialog] No codes found, auto-retrying (attempt ${refreshAttempts + 1}/8)`);
        refetch({ cancelRefetch: false })
          .then(result => {
            console.log(`[DiscountCodesDialog] Auto-retry ${refreshAttempts + 1} completed with ${result.data?.length || 0} codes`);
            
            // Only count non-manually triggered refetches for the retry counter
            if (!isManuallyTriggeredFetch) {
              setRefreshAttempts(prev => prev + 1);
            }
            setIsManuallyTriggeredFetch(false);
          })
          .catch(error => {
            console.error(`[DiscountCodesDialog] ❌ Auto-retry ${refreshAttempts + 1} failed:`, error);
            setIsManuallyTriggeredFetch(false);
          });
      }, 4000); // Longer wait between retries (4 seconds)
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, deal?.id, isLoaded, discountCodes.length, isLoading, isFetching, refreshAttempts, refetch, isManuallyTriggeredFetch]);

  // Display toast notification if we've retried several times without finding codes
  useEffect(() => {
    if (refreshAttempts === 8 && discountCodes.length === 0) {
      toast.warning("Kunde inte hitta några rabattkoder efter flera försök", {
        description: "Det kan ta en stund innan koderna dyker upp i systemet. Försök ladda om sidan om en liten stund."
      });
    }
  }, [refreshAttempts, discountCodes.length]);

  // Manual verification if automatic refetch doesn't find codes
  useEffect(() => {
    const verifyCodesDirectly = async () => {
      if (refreshAttempts >= 5 && discountCodes.length === 0 && deal?.id) {
        try {
          console.log(`[DiscountCodesDialog] Attempting direct database verification for deal ${deal.id}`);
          
          const { data, error } = await supabase
            .from('discount_codes')
            .select('*')
            .eq('deal_id', deal.id);
            
          if (error) {
            console.error('[DiscountCodesDialog] ❌ Direct verification error:', error);
          } else if (data && data.length > 0) {
            console.log(`[DiscountCodesDialog] ✓ Direct verification found ${data.length} codes!`);
            console.log('[DiscountCodesDialog] Sample codes from direct check:', 
              data.slice(0, 3).map((c: any) => c.code).join(', '));
              
            // Force another refresh since we know codes exist
            refetch({ cancelRefetch: false });
          } else {
            console.log(`[DiscountCodesDialog] ⚠️ Direct verification confirmed no codes for deal ${deal.id}`);
          }
        } catch (err) {
          console.error('[DiscountCodesDialog] ❌ Exception in direct verification:', err);
        }
      }
    };
    
    verifyCodesDirectly();
  }, [refreshAttempts, discountCodes.length, deal?.id, refetch]);

  const handleManualRefresh = useCallback(() => {
    if (isFetching) return;
    
    const newCount = manualRefreshCount + 1;
    console.log(`[DiscountCodesDialog] 🔄 Manual refresh #${newCount} triggered`);
    setManualRefreshCount(newCount);
    setIsManuallyTriggeredFetch(true);
    
    toast.promise(
      refetch({ cancelRefetch: false }).then(result => {
        console.log(`[DiscountCodesDialog] ✓ Manual refresh returned ${result.data?.length || 0} codes`);
        return result;
      }),
      {
        loading: 'Uppdaterar rabattkoder...',
        success: (result) => {
          const count = result.data?.length || 0;
          return count > 0 
            ? `Hittade ${count} rabattkoder` 
            : "Uppdaterat men inga rabattkoder hittades";
        },
        error: 'Kunde inte hämta rabattkoderna'
      }
    );
  }, [refetch, isFetching, manualRefreshCount]);

  // Function to directly inspect codes in the database
  const handleInspectCodes = useCallback(async () => {
    if (!deal?.id) return;
    
    setIsInspecting(true);
    
    try {
      console.log(`[DiscountCodesDialog] 🔍 Manually inspecting codes for deal ${deal.id}`);
      const result = await inspectDiscountCodes(deal.id);
      setInspectionResult(result);
      
      toast.info(
        result.success 
          ? `Hittade ${result.codesCount} rabattkoder i databasen` 
          : "Kunde inte hitta rabattkoder i databasen",
        {
          description: result.message
        }
      );
      
      // If codes were found but not showing in UI, force a refetch
      if (result.success && result.codesCount > 0 && discountCodes.length === 0) {
        console.log('[DiscountCodesDialog] Codes found in inspection but not in UI - forcing refetch');
        refetch({ cancelRefetch: false });
      }
    } catch (err) {
      console.error('[DiscountCodesDialog] ❌ Error inspecting codes:', err);
      setInspectionResult({ success: false, error: err, message: 'Ett fel uppstod vid inspektion av rabattkoder' });
      
      toast.error('Kunde inte inspektera rabattkoder', {
        description: 'Ett tekniskt fel uppstod vid inspektionen'
      });
    } finally {
      setIsInspecting(false);
    }
  }, [deal?.id, discountCodes.length, refetch]);

  // Calculate time elapsed since dialog opened (for debugging)
  const timeElapsedText = dialogOpenedAt ? 
    `Dialog öppnades för ${Math.round((new Date().getTime() - dialogOpenedAt.getTime()) / 1000)}s sedan` : '';

  const getEmptyStateMessage = useCallback(() => {
    if (refreshAttempts >= 8) {
      return "Inga rabattkoder hittades efter flera försök. Kontrollera databasen eller generera nya koder.";
    } else if (refreshAttempts > 0) {
      return `Letar efter rabattkoder... (försök ${refreshAttempts}/8)`;
    }
    return "Letar efter rabattkoder...";
  }, [refreshAttempts]);

  return {
    discountCodes,
    isLoading,
    isFetching,
    error,
    refreshAttempts,
    manualRefreshCount,
    isInspecting,
    inspectionResult,
    timeElapsedText,
    isLoaded,
    handleManualRefresh,
    handleInspectCodes,
    getEmptyStateMessage
  };
};
