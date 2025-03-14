
import { useState, useCallback } from "react";
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
  
  // Handle opening the dialog for a specific deal
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    console.log("[DiscountCodesDialogManager] Viewing discount codes for deal:", deal.id, deal.title);
    setIsViewingCodes(true);
    setViewingCodesForDeal(deal);
  }, []);
  
  // Handle closing the dialog
  const handleCloseDiscountCodesDialog = useCallback(() => {
    setIsClosingCodesDialog(true);
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
      setIsViewingCodes(false);
      resetJustCreatedDeal();
    }, 300);
  }, [resetJustCreatedDeal]);
  
  // Effect to show discount codes for newly created deals
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
