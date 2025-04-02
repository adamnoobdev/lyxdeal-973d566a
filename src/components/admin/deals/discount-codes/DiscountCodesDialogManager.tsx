
import { useState, useCallback, useEffect, useRef } from "react";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialog } from "../DiscountCodesDialog";
import { logIdInfo } from "@/utils/discount-codes/types";

interface DiscountCodesDialogManagerProps {
  onGenerateDiscountCodes: (deal: Deal, quantity: number) => Promise<void>;
  justCreatedDeal: Deal | null;
  resetJustCreatedDeal: () => void;
}

export const DiscountCodesDialogManager = ({
  onGenerateDiscountCodes,
  justCreatedDeal,
  resetJustCreatedDeal
}: DiscountCodesDialogManagerProps) => {
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Track timeouts to clear them if needed
  const closeTimeoutRef = useRef<number | null>(null);
  
  // Effect för att automatiskt visa rabattkoder för nyligen skapade erbjudanden
  useEffect(() => {
    if (justCreatedDeal && !viewingCodesForDeal && !isClosingCodesDialog && !isDialogOpen) {
      console.log("[DiscountCodesDialogManager] Auto-showing discount codes for newly created deal:", justCreatedDeal.id);
      logIdInfo("DiscountCodesDialogManager justCreatedDeal", justCreatedDeal.id);
      setIsDialogOpen(true);
      setViewingCodesForDeal(justCreatedDeal);
    }
    
    // Cleanup timeouts on unmount or when dependencies change
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [justCreatedDeal, viewingCodesForDeal, isClosingCodesDialog, isDialogOpen]);
  
  // Hantera öppning av dialogen för ett specifikt erbjudande
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    console.log("[DiscountCodesDialogManager] Viewing discount codes for deal:", deal.id, deal.title);
    logIdInfo("DiscountCodesDialogManager viewDiscountCodes", deal.id);
    
    // Clear any closing states first to prevent conflicts
    setIsClosingCodesDialog(false);
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    setIsDialogOpen(true);
    setViewingCodesForDeal(deal);
  }, []);
  
  // Hantera stängning av dialogen
  const handleCloseDiscountCodesDialog = useCallback(() => {
    console.log("[DiscountCodesDialogManager] Closing discount codes dialog");
    
    // Prevent multiple close operations
    if (isClosingCodesDialog) {
      console.log("[DiscountCodesDialogManager] Already closing, ignoring duplicate close request");
      return;
    }
    
    // Set the closing state first to prevent UI interactions
    setIsClosingCodesDialog(true);
    setIsDialogOpen(false);
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    
    // Använd setTimeout för att förhindra att statet uppdateras medan dialogen fortfarande stängs
    closeTimeoutRef.current = window.setTimeout(() => {
      console.log("[DiscountCodesDialogManager] Timeout completed, resetting states");
      
      // Reset states in the correct order
      setViewingCodesForDeal(null);
      
      if (justCreatedDeal) {
        resetJustCreatedDeal();
      }
      
      setIsClosingCodesDialog(false);
      closeTimeoutRef.current = null;
    }, 300);
  }, [resetJustCreatedDeal, justCreatedDeal, isClosingCodesDialog]);
  
  // Avgör vilket erbjudande som ska visas (antingen via explicit visning eller auto-visning av nya)
  const activeDeal = viewingCodesForDeal || justCreatedDeal;
  
  // Logga aktivt deal för felsökning
  useEffect(() => {
    if (activeDeal) {
      logIdInfo("DiscountCodesDialogManager activeDeal", activeDeal.id);
      console.log(`[DiscountCodesDialogManager] Dialog open: ${isDialogOpen}, active deal:`, activeDeal.title);
    }
  }, [activeDeal, isDialogOpen]);
  
  return {
    discountCodesDialog: (
      <DiscountCodesDialog
        isOpen={isDialogOpen && !isClosingCodesDialog && !!activeDeal}
        onClose={handleCloseDiscountCodesDialog}
        deal={activeDeal}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
    ),
    handleViewDiscountCodes
  };
};
