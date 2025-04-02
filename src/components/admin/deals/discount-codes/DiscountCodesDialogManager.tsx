
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const operationInProgressRef = useRef(false);
  
  // Effect för att automatiskt visa rabattkoder för nyligen skapade erbjudanden
  useEffect(() => {
    if (justCreatedDeal && !viewingCodesForDeal && !operationInProgressRef.current && !isDialogOpen) {
      console.log("[DiscountCodesDialogManager] Auto-showing discount codes for newly created deal:", justCreatedDeal.id);
      logIdInfo("DiscountCodesDialogManager justCreatedDeal", justCreatedDeal.id);
      
      setIsDialogOpen(true);
      setViewingCodesForDeal(justCreatedDeal);
    }
    
    return () => {
      console.log("[DiscountCodesDialogManager] Cleanup effect running");
    };
  }, [justCreatedDeal, viewingCodesForDeal, isDialogOpen]);
  
  // Hantera öppning av dialogen för ett specifikt erbjudande
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    console.log("[DiscountCodesDialogManager] Viewing discount codes for deal:", deal.id, deal.title);
    logIdInfo("DiscountCodesDialogManager viewDiscountCodes", deal.id);
    
    // Förhindra operation om en annan pågår
    if (operationInProgressRef.current) {
      console.log("[DiscountCodesDialogManager] Operation in progress, ignoring new request");
      return;
    }
    
    setIsDialogOpen(true);
    setViewingCodesForDeal(deal);
  }, []);
  
  // Hantera stängning av dialogen
  const handleCloseDiscountCodesDialog = useCallback(() => {
    console.log("[DiscountCodesDialogManager] Closing discount codes dialog");
    
    // Markera att en operation pågår för att förhindra konflikt
    if (operationInProgressRef.current) {
      console.log("[DiscountCodesDialogManager] Already closing, ignoring duplicate close request");
      return;
    }
    
    operationInProgressRef.current = true;
    
    // Först stäng dialogen...
    setIsDialogOpen(false);
    
    // ...sedan rensa tillståndet i ett separat event för att ge dialogkomponenten tid att stängas
    setTimeout(() => {
      console.log("[DiscountCodesDialogManager] Resetting states after dialog closed");
      
      setViewingCodesForDeal(null);
      
      if (justCreatedDeal) {
        resetJustCreatedDeal();
      }
      
      // Markera att operationen är slutförd
      operationInProgressRef.current = false;
    }, 300);
  }, [resetJustCreatedDeal, justCreatedDeal]);
  
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
        isOpen={isDialogOpen && !!activeDeal}
        onClose={handleCloseDiscountCodesDialog}
        deal={activeDeal}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
    ),
    handleViewDiscountCodes
  };
};
