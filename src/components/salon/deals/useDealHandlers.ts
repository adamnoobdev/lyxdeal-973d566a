
import { useCallback } from 'react';
import { Deal } from '@/components/admin/types';
import { toast } from 'sonner';
import { generateDiscountCodes } from '@/utils/discount-codes';

export const useDealHandlers = (
  setViewingCodesForDeal: (deal: Deal | null) => void,
  setEditingDeal: (deal: Deal | null) => void,
  setIsDialogOpen: (isOpen: boolean) => void,
  handleUpdate: (values: any) => Promise<void>,
  refetch: () => Promise<unknown>,
  isProcessingAction: boolean,
  setIsProcessingAction: (isProcessing: boolean) => void,
  isGeneratingCodes: boolean,
  setIsGeneratingCodes: (isGenerating: boolean) => void,
  setIsClosingCodesDialog: (isClosing: boolean) => void
) => {
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    if (isProcessingAction) return;
    console.log("[SalonDeals] Opening discount codes dialog for deal:", deal.id);
    setViewingCodesForDeal(deal);
  }, [isProcessingAction, setViewingCodesForDeal]);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    if (isProcessingAction) return;
    console.log("[SalonDeals] Closing discount codes dialog");
    
    // Set closing state to prevent UI freeze
    setIsClosingCodesDialog(true);
    
    // Use setTimeout to delay state updates
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
    }, 300);
  }, [isProcessingAction, setViewingCodesForDeal, setIsClosingCodesDialog]);
  
  const handleEditDeal = useCallback((deal: Deal) => {
    if (isProcessingAction) return;
    console.log("[SalonDeals] Opening edit deal dialog for deal:", deal.id);
    setEditingDeal(deal);
    setIsDialogOpen(true);
  }, [setEditingDeal, isProcessingAction, setIsDialogOpen]);
  
  const handleCloseDealDialog = useCallback(() => {
    if (isProcessingAction) return;
    console.log("[SalonDeals] Closing deal dialog");
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingDeal(null);
    }, 100);
  }, [setEditingDeal, isProcessingAction, setIsDialogOpen]);
  
  const handleUpdateDeal = useCallback(async (values: any) => {
    if (isProcessingAction) return;
    
    try {
      console.log("[SalonDeals] Starting deal update");
      setIsProcessingAction(true);
      await handleUpdate(values);
      await refetch();
    } catch (error) {
      console.error("[SalonDeals] Error updating deal:", error);
    } finally {
      setIsProcessingAction(false);
      console.log("[SalonDeals] Finished deal update, closing dialog");
      handleCloseDealDialog();
    }
  }, [handleUpdate, handleCloseDealDialog, isProcessingAction, refetch, setIsProcessingAction]);

  const handleGenerateDiscountCodes = useCallback(async (deal: Deal, quantity: number) => {
    if (isGeneratingCodes) return Promise.reject(new Error("Redan genererar koder"));
    
    try {
      setIsGeneratingCodes(true);
      await toast.promise(
        generateDiscountCodes(deal.id, quantity),
        {
          loading: `Genererar ${quantity} rabattkoder...`,
          success: `${quantity} rabattkoder genererades för "${deal.title}"`,
          error: 'Kunde inte generera rabattkoder'
        }
      );
      return Promise.resolve();
    } catch (error) {
      console.error("[SalonDeals] Error generating discount codes:", error);
      return Promise.reject(error);
    } finally {
      setIsGeneratingCodes(false);
    }
  }, [isGeneratingCodes, setIsGeneratingCodes]);

  return {
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleEditDeal,
    handleCloseDealDialog,
    handleUpdateDeal,
    handleGenerateDiscountCodes
  };
};
