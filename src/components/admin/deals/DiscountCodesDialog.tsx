
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
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  console.log(`[DiscountCodesDialog] Rendering with isOpen=${isOpen}, deal=${deal?.id || 'null'}`);
  
  const { discountCodes, isLoading, error, refetch, isFetching } = useDiscountCodes(isOpen ? deal?.id : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  
  // Track dialog opening time for debugging purposes
  const [dialogOpenedAt, setDialogOpenedAt] = useState<Date | null>(null);

  // Reset internal state when dialog opens/closes and trigger refetch when dialog opens
  useEffect(() => {
    if (isOpen && deal?.id) {
      const now = new Date();
      console.log(`[DiscountCodesDialog] Dialog opened at ${now.toISOString()} for deal ID: ${deal.id}, triggering refetch`);
      setDialogOpenedAt(now);
      setIsLoaded(true);
      setRefreshAttempts(0);
      setManualRefreshCount(0);
      
      // Force a refetch when the dialog opens to get fresh data
      refetch().then(result => {
        console.log(`[DiscountCodesDialog] Initial refetch completed with ${result.data?.length || 0} codes`);
      }).catch(err => {
        console.error(`[DiscountCodesDialog] Error during initial refetch:`, err);
      });
    } else if (!isOpen) {
      console.log("[DiscountCodesDialog] Dialog closed or no deal selected");
      setDialogOpenedAt(null);
    }
  }, [isOpen, deal?.id, refetch]);

  // Automatically retry fetching if no codes are found on first load
  useEffect(() => {
    if (isOpen && deal?.id && isLoaded && discountCodes.length === 0 && !isLoading && refreshAttempts < 5) {
      const timer = setTimeout(() => {
        console.log(`[DiscountCodesDialog] No codes found, auto-retrying (attempt ${refreshAttempts + 1}/5)`);
        refetch().then(result => {
          console.log(`[DiscountCodesDialog] Auto-retry ${refreshAttempts + 1} completed with ${result.data?.length || 0} codes`);
        });
        setRefreshAttempts(prev => prev + 1);
      }, 3000); // Wait 3 seconds before retrying
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, deal?.id, isLoaded, discountCodes.length, isLoading, refreshAttempts, refetch]);

  // Display toast notification if we've retried several times without finding codes
  useEffect(() => {
    if (refreshAttempts === 5 && discountCodes.length === 0) {
      toast.warning("Kunde inte hitta några rabattkoder efter flera försök", {
        description: "Det kan ta en stund innan koderna dyker upp i systemet. Försök ladda om sidan om en liten stund."
      });
    }
  }, [refreshAttempts, discountCodes.length]);

  const handleManualRefresh = useCallback(() => {
    if (isFetching) return;
    
    const newCount = manualRefreshCount + 1;
    console.log(`[DiscountCodesDialog] Manual refresh #${newCount} triggered`);
    setManualRefreshCount(newCount);
    
    toast.promise(
      refetch().then(result => {
        console.log(`[DiscountCodesDialog] Manual refresh returned ${result.data?.length || 0} codes`);
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
    console.error("[DiscountCodesDialog] Error loading discount codes:", error);
  }

  // Calculate time elapsed since dialog opened (for debugging)
  const timeElapsedText = dialogOpenedAt ? 
    `Dialog opened ${Math.round((new Date().getTime() - dialogOpenedAt.getTime()) / 1000)}s ago` : '';

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
            {discountCodes.length === 0 && !isLoading && (
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
        
        <div className="flex-1 overflow-auto mt-4">
          <DiscountCodesTable 
            codes={discountCodes} 
            isLoading={isLoading} 
            emptyStateMessage={
              refreshAttempts >= 5 
                ? "Inga rabattkoder hittades efter flera försök. Kontrollera databasen eller generera nya koder."
                : refreshAttempts > 0
                  ? `Letar efter rabattkoder... (försök ${refreshAttempts}/5)`
                  : "Letar efter rabattkoder..."
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
