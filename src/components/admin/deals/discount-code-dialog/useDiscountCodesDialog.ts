
import { useState, useEffect, useCallback } from "react";
import { useDiscountCodes } from "@/hooks/useDiscountCodes";
import { inspectDiscountCodes } from "@/utils/discountCodes";
import { toast } from "sonner";
import { Deal } from "@/components/admin/types";

export const useDiscountCodesDialog = (isOpen: boolean, deal: Deal | null) => {
  const { discountCodes, isLoading, error, refetch, isFetching } = useDiscountCodes(isOpen ? deal?.id : undefined);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [isManuallyTriggeredFetch, setIsManuallyTriggeredFetch] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [dialogOpenedAt, setDialogOpenedAt] = useState<Date | null>(null);

  // Reset internt tillstånd när dialogen öppnas/stängs
  useEffect(() => {
    if (isOpen && deal?.id) {
      const now = new Date();
      console.log(`[DiscountCodesDialog] Dialog opened for deal ID: ${deal.id}`);
      setDialogOpenedAt(now);
      setRefreshAttempts(0);
      setIsManuallyTriggeredFetch(false);
      setInspectionResult(null);
      
      // Tvinga en refetch när dialogen öppnas för att få färsk data
      console.log(`[DiscountCodesDialog] Forcing initial refetch for deal ID ${deal.id}`);
      refetch({ cancelRefetch: false });
    } else if (!isOpen) {
      setDialogOpenedAt(null);
    }
  }, [isOpen, deal?.id, refetch]);

  // Automatiskt försök hämta igen om inga koder hittas vid första laddningen
  useEffect(() => {
    if (isOpen && deal?.id && discountCodes.length === 0 && !isLoading && !isFetching && refreshAttempts < 5) {
      const timer = setTimeout(() => {
        console.log(`[DiscountCodesDialog] Auto-retry (attempt ${refreshAttempts + 1}/5) for deal ID ${deal.id}`);
        refetch({ cancelRefetch: false })
          .then(() => {
            if (!isManuallyTriggeredFetch) {
              setRefreshAttempts(prev => prev + 1);
            }
            setIsManuallyTriggeredFetch(false);
          });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, deal?.id, discountCodes.length, isLoading, isFetching, refreshAttempts, refetch, isManuallyTriggeredFetch]);

  // Visa meddelande om vi försökt flera gånger utan att hitta koder
  useEffect(() => {
    if (refreshAttempts === 5 && discountCodes.length === 0) {
      toast.warning("Inga rabattkoder hittades efter flera försök", {
        description: "Det kan ta en stund innan koderna dyker upp i systemet. Prova inspektionsfunktionen."
      });
      
      // Utför automatisk inspektion när vi inte hittat koder efter flera försök
      if (deal?.id) {
        console.log(`[DiscountCodesDialog] Auto-inspection after 5 attempts for deal ID ${deal.id}`);
        handleInspectCodes();
      }
    }
  }, [refreshAttempts, discountCodes.length]);

  const handleManualRefresh = useCallback(() => {
    if (isFetching) return;
    
    setIsManuallyTriggeredFetch(true);
    
    toast.promise(
      refetch({ cancelRefetch: false }),
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
  }, [refetch, isFetching, deal?.id]);

  // Funktion för att direkt inspektera koder i databasen
  const handleInspectCodes = useCallback(async () => {
    if (!deal?.id) return;
    
    setIsInspecting(true);
    
    try {
      console.log(`[DiscountCodesDialog] Inspecting codes for deal ${deal.id}`);
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
      
      // Om koder hittades men inte visas i UI, force:a en refetch
      if (result.success && result.codesCount > 0 && discountCodes.length === 0) {
        console.log('[DiscountCodesDialog] Koder hittades i inspektion men inte i UI - tvingar refetch');
        refetch({ cancelRefetch: false });
      }
    } catch (err) {
      console.error('[DiscountCodesDialog] Error inspecting codes:', err);
      setInspectionResult({ success: false, error: err, message: 'Ett fel uppstod vid inspektion av rabattkoder' });
      
      toast.error('Kunde inte inspektera rabattkoder', {
        description: 'Ett tekniskt fel uppstod vid inspektionen'
      });
    } finally {
      setIsInspecting(false);
    }
  }, [deal?.id, discountCodes.length, refetch]);

  // Beräkna tid sedan dialog öppnades (för felsökning)
  const timeElapsedText = dialogOpenedAt ? 
    `Dialog öppnades för ${Math.round((new Date().getTime() - dialogOpenedAt.getTime()) / 1000)}s sedan` : '';

  const getEmptyStateMessage = useCallback(() => {
    if (refreshAttempts >= 5) {
      return "Inga rabattkoder hittades efter flera försök. Använd inspektionsfunktionen för att kontrollera databasen eller generera nya.";
    } else if (refreshAttempts > 0) {
      return `Letar efter rabattkoder... (försök ${refreshAttempts}/5)`;
    }
    return "Letar efter rabattkoder...";
  }, [refreshAttempts]);

  return {
    discountCodes,
    isLoading,
    isFetching,
    error,
    refreshAttempts,
    isInspecting,
    inspectionResult,
    timeElapsedText,
    handleManualRefresh,
    handleInspectCodes,
    getEmptyStateMessage
  };
};
