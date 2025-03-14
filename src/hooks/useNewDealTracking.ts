
import { useState, useRef, useEffect, useCallback } from "react";
import { Deal } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook to track and find newly created deals
 */
export const useNewDealTracking = (
  refetch: () => Promise<unknown>
) => {
  const [dealCreationState, setDealCreationState] = useState<{
    timestamp: number | null;
    attempts: number;
    justCreatedDeal: Deal | null;
  }>({
    timestamp: null,
    attempts: 0,
    justCreatedDeal: null
  });

  // Find the newly created deal after creation
  useEffect(() => {
    const findNewlyCreatedDeal = async () => {
      const MAX_ATTEMPTS = 10;
      
      if (dealCreationState.timestamp && !dealCreationState.justCreatedDeal && 
          dealCreationState.attempts < MAX_ATTEMPTS) {
        try {
          const newAttempts = dealCreationState.attempts + 1;
          setDealCreationState(prev => ({ ...prev, attempts: newAttempts }));
          
          console.log(`[useNewDealTracking] Attempting to find newly created deal (attempt ${newAttempts}/${MAX_ATTEMPTS})`);
          
          const creationTime = new Date(dealCreationState.timestamp).toISOString();
          const { data: newDeals, error } = await supabase
            .from('deals')
            .select('*')
            .gte('created_at', creationTime)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (error) {
            console.error("[useNewDealTracking] Error finding new deal:", error);
          } else if (newDeals && newDeals.length > 0) {
            console.log("[useNewDealTracking] Found newly created deal:", newDeals[0]);
            setDealCreationState(prev => ({ ...prev, justCreatedDeal: newDeals[0] as Deal }));
            
            refetch();
          } else {
            console.log("[useNewDealTracking] No newly created deals found, will retry...");
            
            if (newAttempts < MAX_ATTEMPTS) {
              setTimeout(findNewlyCreatedDeal, 1500);
            } else {
              console.warn("[useNewDealTracking] Failed to find newly created deal after maximum attempts");
              toast.warning("Kunde inte hitta det nyskapade erbjudandet", {
                description: "Rabattkoder kan ha genererats men kan inte visas automatiskt. Leta efter erbjudandet i listan och klicka på 'Visa rabattkoder'."
              });
              setDealCreationState({ timestamp: null, attempts: 0, justCreatedDeal: null });
            }
          }
        } catch (error) {
          console.error("[useNewDealTracking] Exception finding new deal:", error);
        }
      }
    };
    
    if (dealCreationState.timestamp) {
      findNewlyCreatedDeal();
    }
  }, [dealCreationState.timestamp, dealCreationState.justCreatedDeal, dealCreationState.attempts, refetch]);

  const resetDealCreationState = useCallback(() => {
    setDealCreationState({
      timestamp: null,
      attempts: 0,
      justCreatedDeal: null
    });
  }, []);

  return {
    dealCreationState,
    setDealCreationState,
    resetDealCreationState,
    justCreatedDeal: dealCreationState.justCreatedDeal
  };
};
