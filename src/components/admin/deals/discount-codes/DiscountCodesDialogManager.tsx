
import { useState, useCallback, useEffect } from "react";
import { Deal } from "@/components/admin/types";
import { DiscountCodesDialog } from "../DiscountCodesDialog";

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
  const [isViewingCodes, setIsViewingCodes] = useState(false);
  
  // Effect för att automatiskt visa rabattkoder för nyligen skapade erbjudanden
  useEffect(() => {
    if (justCreatedDeal && !viewingCodesForDeal && !isClosingCodesDialog && !isViewingCodes) {
      console.log("[DiscountCodesDialogManager] Auto-showing discount codes for newly created deal:", justCreatedDeal.id);
      setIsViewingCodes(true);
      setViewingCodesForDeal(justCreatedDeal);
    }
  }, [justCreatedDeal, viewingCodesForDeal, isClosingCodesDialog, isViewingCodes]);
  
  // Hantera öppning av dialogen för ett specifikt erbjudande
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    console.log("[DiscountCodesDialogManager] Viewing discount codes for deal:", deal.id, deal.title);
    setIsViewingCodes(true);
    setViewingCodesForDeal(deal);
  }, []);
  
  // Hantera stängning av dialogen
  const handleCloseDiscountCodesDialog = useCallback(() => {
    setIsClosingCodesDialog(true);
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
      setIsViewingCodes(false);
      resetJustCreatedDeal();
    }, 300);
  }, [resetJustCreatedDeal]);
  
  // Avgör vilket erbjudande som ska visas (antingen via explicit visning eller auto-visning av nya)
  const activeDeal = viewingCodesForDeal || justCreatedDeal;
  const isDialogOpen = !!activeDeal && !isClosingCodesDialog;
  
  return {
    discountCodesDialog: (
      <DiscountCodesDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDiscountCodesDialog}
        deal={activeDeal}
        onGenerateDiscountCodes={onGenerateDiscountCodes}
      />
    ),
    handleViewDiscountCodes
  };
};
