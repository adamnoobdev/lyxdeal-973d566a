
import { useCallback } from 'react';
import { Deal } from '@/components/admin/types';
import { FormValues } from '@/components/deal-form/schema';
import { toast } from 'sonner';
import { generateDiscountCodes } from '@/utils/discount-codes';

export const useDealHandlers = (
  setViewingCodesForDeal: (deal: Deal | null) => void,
  setEditingDeal: (deal: Deal | null) => void,
  setIsDialogOpen: (isOpen: boolean) => void,
  handleUpdate: (values: FormValues) => Promise<boolean>,
  refetch: () => Promise<any>,
  isProcessingAction: boolean,
  setIsProcessingAction: (isProcessing: boolean) => void,
  isGeneratingCodes: boolean,
  setIsGeneratingCodes: (isGenerating: boolean) => void,
  setIsClosingCodesDialog: (isClosing: boolean) => void
) => {
  const handleEditDeal = useCallback((deal: Deal) => {
    setEditingDeal(deal);
    setIsDialogOpen(true);
    console.log("[useDealHandlers] Editing deal:", deal.id);
  }, [setEditingDeal, setIsDialogOpen]);

  const handleCloseDealDialog = useCallback(() => {
    if (isProcessingAction) return;
    
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingDeal(null);
    }, 200);
  }, [setIsDialogOpen, setEditingDeal, isProcessingAction]);

  const handleUpdateDeal = useCallback(async (values: FormValues): Promise<boolean> => {
    if (isProcessingAction) return false;
    
    try {
      setIsProcessingAction(true);
      console.log("[useDealHandlers] Updating deal");
      
      const success = await handleUpdate(values);
      if (success) {
        await refetch();
        setIsDialogOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[useDealHandlers] Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  }, [handleUpdate, refetch, setIsDialogOpen, isProcessingAction, setIsProcessingAction]);

  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    if (!deal.requires_discount_code) {
      toast.info("Detta erbjudande använder inte rabattkoder");
      return;
    }
    
    setViewingCodesForDeal(deal);
  }, [setViewingCodesForDeal]);

  const handleCloseDiscountCodesDialog = useCallback(() => {
    setIsClosingCodesDialog(true);
    
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
    }, 300);
  }, [setViewingCodesForDeal, setIsClosingCodesDialog]);

  const handleGenerateDiscountCodes = useCallback(async (deal: Deal, quantity: number = 10) => {
    if (isGeneratingCodes || !deal.requires_discount_code) return;
    
    try {
      setIsGeneratingCodes(true);
      toast.loading("Genererar rabattkoder...");
      
      await generateDiscountCodes(deal.id, quantity);
      
      toast.dismiss();
      toast.success(`${quantity} rabattkoder har genererats`);
      
      await refetch();
    } catch (error) {
      console.error("[useDealHandlers] Error generating discount codes:", error);
      toast.error("Ett fel uppstod när rabattkoder skulle genereras");
    } finally {
      setIsGeneratingCodes(false);
    }
  }, [refetch, isGeneratingCodes, setIsGeneratingCodes]);

  return {
    handleEditDeal,
    handleCloseDealDialog,
    handleUpdateDeal,
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleGenerateDiscountCodes
  };
};
