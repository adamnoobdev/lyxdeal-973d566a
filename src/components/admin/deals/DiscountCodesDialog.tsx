
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DiscountCodesTable } from "@/components/discount-codes/DiscountCodesTable";
import { useDiscountCodes } from "@/hooks/useDiscountCodes";
import { Deal } from "@/components/admin/types";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface DiscountCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

export const DiscountCodesDialog = ({
  isOpen,
  onClose,
  deal,
}: DiscountCodesDialogProps) => {
  console.log(`[DiscountCodesDialog] 🔄 Rendering with isOpen=${isOpen}, deal=${deal?.id || 'null'}`);
  
  const { discountCodes, isLoading, error, refetch, isFetching } = useDiscountCodes(isOpen ? deal?.id : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [isManuallyTriggeredFetch, setIsManuallyTriggeredFetch] = useState(false);
  
  // Track dialog opening time for debugging purposes
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

  if (error) {
    console.error("[DiscountCodesDialog] ❌ Error loading discount codes:", error);
  }

  // Calculate time elapsed since dialog opened (for debugging)
  const timeElapsedText = dialogOpenedAt ? 
    `Dialog öppnades för ${Math.round((new Date().getTime() - dialogOpenedAt.getTime()) / 1000)}s sedan` : '';

  const getEmptyStateMessage = () => {
    if (refreshAttempts >= 8) {
      return "Inga rabattkoder hittades efter flera försök. Kontrollera databasen eller generera nya koder.";
    } else if (refreshAttempts > 0) {
      return `Letar efter rabattkoder... (försök ${refreshAttempts}/8)`;
    }
    return "Letar efter rabattkoder...";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <DialogTitle>Rabattkoder - {deal?.title}</DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh} 
              disabled={isFetching}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              <span>Uppdatera</span>
            </Button>
          </div>
          <DialogDescription>
            Här ser du alla rabattkoder som genererats för detta erbjudande och deras status.
            {discountCodes.length === 0 && !isLoading && !isFetching && (
              <span className="block mt-1 text-amber-500">
                Inga rabattkoder hittades. Använd uppdatera-knappen för att försöka igen.
              </span>
            )}
            {timeElapsedText && (
              <span className="block mt-1 text-xs text-muted-foreground opacity-50">
                {timeElapsedText}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Det uppstod ett fel när rabattkoderna skulle hämtas. Försök igen senare.
            </AlertDescription>
          </Alert>
        )}
        
        {discountCodes.length === 0 && refreshAttempts >= 5 && !isLoading && !isFetching && (
          <Alert variant="warning" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vi har inte hittat några rabattkoder efter flera försök. Det kan bero på att genereringen misslyckades eller att det finns en fördröjning. 
              Prova att uppdatera sidan eller generera nya rabattkoder för erbjudandet.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex-1 overflow-auto mt-4">
          <DiscountCodesTable 
            codes={discountCodes} 
            isLoading={isLoading || isFetching}
            emptyStateMessage={getEmptyStateMessage()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
