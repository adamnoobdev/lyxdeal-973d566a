
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";

export type DealCreationState = {
  timestamp: number | null;
  attempts: number;
  justCreatedDeal: Deal | null;
};

/**
 * Hook för att spåra nyligen skapade erbjudanden och hitta dem i databasen
 */
export const useNewDealTracking = (refetch: () => Promise<unknown>) => {
  const [dealCreationState, setDealCreationState] = useState<DealCreationState>({
    timestamp: null,
    attempts: 0,
    justCreatedDeal: null
  });

  // Återställ skapandetillståndet
  const resetDealCreationState = useCallback(() => {
    setDealCreationState({
      timestamp: null,
      attempts: 0,
      justCreatedDeal: null
    });
  }, []);

  // Titta efter det nyligen skapade erbjudandet baserat på tidsstämpel
  useEffect(() => {
    if (!dealCreationState.timestamp || dealCreationState.attempts >= 5 || dealCreationState.justCreatedDeal) {
      return;
    }

    const getNewlyCreatedDeal = async () => {
      try {
        console.log(`[useNewDealTracking] Looking for newly created deal, attempt ${dealCreationState.attempts + 1}`);
        
        // Hämta det senaste erbjudandet, skapat efter tidsstämpeln
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .gt('created_at', new Date(dealCreationState.timestamp - 5000).toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error("[useNewDealTracking] Error finding newly created deal:", error);
          return;
        }

        if (data && data.length > 0) {
          const newDeal = data[0] as Deal;
          console.log("[useNewDealTracking] Found newly created deal:", newDeal);
          
          setDealCreationState(prev => ({
            ...prev,
            justCreatedDeal: newDeal
          }));
          
          // Kör en extra refetch för att säkerställa att listan är uppdaterad
          refetch();
        } else {
          // Försök igen om vi inte har hittat erbjudandet än
          setDealCreationState(prev => ({
            ...prev,
            attempts: prev.attempts + 1
          }));
        }
      } catch (error) {
        console.error("[useNewDealTracking] Error in deal tracking:", error);
      }
    };

    // Vänta en kort stund innan sökning efter nytt erbjudande
    const timer = setTimeout(() => {
      getNewlyCreatedDeal();
    }, 1000);

    return () => clearTimeout(timer);
  }, [dealCreationState, refetch]);

  return {
    dealCreationState,
    setDealCreationState,
    resetDealCreationState,
    justCreatedDeal: dealCreationState.justCreatedDeal
  };
};
