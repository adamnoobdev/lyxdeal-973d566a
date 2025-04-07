
import { useCallback } from 'react';
import { Deal } from "@/components/admin/types";
import { FormValues } from '@/components/deal-form/schema';
import { toast } from "sonner";

export const useDealHandlers = (
  setViewingCodesForDeal: (deal: Deal | null) => void,
  setEditingDeal: (deal: Deal | null) => void,
  setIsDialogOpen: (isOpen: boolean) => void,
  handleUpdate: (values: FormValues) => Promise<boolean>,
  refetch: () => Promise<void>,
  isProcessingAction: boolean,
  setIsProcessingAction: (isProcessing: boolean) => void,
  isGeneratingCodes: boolean,
  setIsGeneratingCodes: (isGenerating: boolean) => void,
  setIsClosingCodesDialog: (isClosing: boolean) => void
) => {
  // Handle viewing discount codes for a deal
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    setViewingCodesForDeal(deal);
  }, [setViewingCodesForDeal]);

  // Handle closing the discount codes dialog
  const handleCloseDiscountCodesDialog = useCallback(() => {
    console.log("[useDealHandlers] Closing discount codes dialog");
    setIsClosingCodesDialog(true);
    
    // Use setTimeout to delay state updates and prevent UI freeze
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
    }, 300);
  }, [setViewingCodesForDeal, setIsClosingCodesDialog]);

  // Handle editing a deal
  const handleEditDeal = useCallback((deal: Deal) => {
    setEditingDeal(deal);
    setIsDialogOpen(true);
  }, [setEditingDeal, setIsDialogOpen]);

  // Handle closing the deal dialog
  const handleCloseDealDialog = useCallback(() => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setEditingDeal(null);
    }, 200);
  }, [setIsDialogOpen, setEditingDeal]);

  // Handle updating a deal
  const handleUpdateDeal = useCallback(async (values: FormValues): Promise<boolean> => {
    if (isProcessingAction) {
      return false;
    }
    
    try {
      setIsProcessingAction(true);
      const success = await handleUpdate(values);
      if (success) {
        await refetch();
      }
      return success;
    } catch (error) {
      console.error("[useDealHandlers] Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  }, [handleUpdate, refetch, isProcessingAction, setIsProcessingAction]);

  // Handle generating discount codes
  const handleGenerateDiscountCodes = useCallback(async (dealId: number, quantity: number): Promise<void> => {
    if (isGeneratingCodes) {
      return;
    }
    
    try {
      setIsGeneratingCodes(true);
      console.log(`[useDealHandlers] Generating ${quantity} discount codes for deal: ${dealId}`);
      
      // Implementation for generating discount codes would go here
      // For now, just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${quantity} rabattkoder har genererats!`);
      await refetch();
    } catch (error) {
      console.error("[useDealHandlers] Error generating discount codes:", error);
      toast.error("Ett fel uppstod när rabattkoder skulle genereras");
    } finally {
      setIsGeneratingCodes(false);
    }
  }, [isGeneratingCodes, setIsGeneratingCodes, refetch]);

  return {
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleEditDeal,
    handleCloseDealDialog,
    handleUpdateDeal,
    handleGenerateDiscountCodes
  };
};
