
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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const { discountCodes, isLoading, error, refetch } = useDiscountCodes(isOpen ? deal?.id : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  // Reset internal state when dialog opens/closes and trigger refetch when dialog opens
  useEffect(() => {
    if (isOpen && deal?.id) {
      console.log("[DiscountCodesDialog] Dialog opened for deal ID:", deal.id, "Triggering refetch");
      setIsLoaded(true);
      setRefreshAttempts(0);
      // Force a refetch when the dialog opens to get fresh data
      refetch();
    }
  }, [isOpen, deal?.id, refetch]);

  // Automatically retry fetching if no codes are found on first load
  useEffect(() => {
    if (isOpen && deal?.id && isLoaded && discountCodes.length === 0 && !isLoading && refreshAttempts < 3) {
      const timer = setTimeout(() => {
        console.log(`[DiscountCodesDialog] No codes found, auto-retrying (attempt ${refreshAttempts + 1}/3)`);
        refetch();
        setRefreshAttempts(prev => prev + 1);
      }, 1500); // Wait 1.5 seconds before retrying
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, deal?.id, isLoaded, discountCodes.length, isLoading, refreshAttempts, refetch]);

  const handleManualRefresh = () => {
    console.log("[DiscountCodesDialog] Manual refresh triggered");
    refetch();
  };

  if (error) {
    console.error("[DiscountCodesDialog] Error loading discount codes:", error);
  }

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
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
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
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto mt-4">
          <DiscountCodesTable 
            codes={discountCodes} 
            isLoading={isLoading || !isLoaded} 
            emptyStateMessage={
              refreshAttempts >= 3 
                ? "Inga rabattkoder hittades efter flera försök. Kontrollera databasen eller generera nya koder."
                : "Letar efter rabattkoder..."
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
