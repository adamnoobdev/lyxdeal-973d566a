
import { useCallback, useState } from 'react';
import { Deal } from "@/types/deal"; // Use the correct Deal type
import { FormValues } from '@/components/deal-form/schema';
import { toast } from "sonner";
import { generateDiscountCodes } from '@/utils/discount-codes';

export const useDealHandlers = (refetch: () => Promise<any>) => {
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const [viewingCodesFor, setViewingCodesFor] = useState<Deal | null>(null);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);

  // Handle viewing discount codes for a deal
  const handleViewDiscountCodes = useCallback((deal: Deal) => {
    if (!deal.requires_discount_code) {
      toast.info("Detta erbjudande använder inte rabattkoder");
      return;
    }
    
    setViewingCodesFor(deal);
  }, []);

  // Handle closing the discount codes dialog
  const handleCloseDiscountCodesDialog = useCallback(() => {
    setIsClosingCodesDialog(true);
    
    setTimeout(() => {
      setViewingCodesFor(null);
      setIsClosingCodesDialog(false);
    }, 300);
  }, []);

  // Handle editing a deal
  const handleEditDeal = useCallback((deal: Deal) => {
    // Implementation for editing deal
    console.log("[useDealHandlers] Editing deal:", deal.id);
  }, []);

  // Handle closing the deal dialog
  const handleCloseDealDialog = useCallback(() => {
    if (isProcessingAction) return;
    
    // Implementation for closing deal dialog
  }, [isProcessingAction]);

  // Handle updating a deal
  const handleUpdateDeal = useCallback(async (values: FormValues): Promise<void> => {
    if (isProcessingAction) return;
    
    try {
      setIsProcessingAction(true);
      console.log("[useDealHandlers] Updating deal");
      
      // Implementation for updating deal
      await refetch();
    } catch (error) {
      console.error("[useDealHandlers] Error updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    } finally {
      setIsProcessingAction(false);
    }
  }, [refetch, isProcessingAction]);

  // Handle creating a deal
  const handleCreateSubmit = useCallback(async (values: FormValues): Promise<void> => {
    if (isProcessingAction) return;
    
    try {
      setIsProcessingAction(true);
      // Implementation for creating a deal
      await refetch();
    } catch (error) {
      console.error("[useDealHandlers] Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    } finally {
      setIsProcessingAction(false);
    }
  }, [refetch, isProcessingAction]);

  // Handle deleting a deal
  const handleDeleteDeal = useCallback(async (deal: Deal): Promise<void> => {
    if (isProcessingAction) return;
    
    try {
      setIsProcessingAction(true);
      // Implementation for deleting a deal
      await refetch();
    } catch (error) {
      console.error("[useDealHandlers] Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle raderas");
    } finally {
      setIsProcessingAction(false);
    }
  }, [refetch, isProcessingAction]);

  // Handle generating discount codes
  const handleGenerateDiscountCodes = useCallback(async (deal: Deal, quantity: number = 10): Promise<void> => {
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
  }, [refetch, isGeneratingCodes]);

  return {
    handleEditDeal,
    handleCloseDealDialog,
    handleUpdateDeal,
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleGenerateDiscountCodes,
    handleCreateSubmit,
    handleDeleteDeal,
    isGeneratingCodes,
    viewingCodesFor,
    isClosingCodesDialog,
    setViewingCodesFor,
    setIsClosingCodesDialog,
  };
};
