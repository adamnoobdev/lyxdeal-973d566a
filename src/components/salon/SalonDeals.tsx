
import React, { useState, useCallback } from 'react';
import { SalonLayout } from './layout/SalonLayout';
import { useSalonDealsState } from './deals/useSalonDealsState';
import { useDealHandlers } from './deals/useDealHandlers';
import { SalonDealsContent } from './deals/SalonDealsContent';
import { SalonDealsDialogs } from './deals/SalonDealsDialogs';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { FormValues } from '@/components/deal-form/schema';

export const SalonDeals: React.FC = () => {
  const {
    dealManagement,
    viewingCodesForDeal,
    setViewingCodesForDeal,
    isProcessingAction,
    setIsProcessingAction,
    isGeneratingCodes,
    setIsGeneratingCodes,
    isDialogOpen,
    setIsDialogOpen,
    isClosingCodesDialog,
    setIsClosingCodesDialog
  } = useSalonDealsState();
  
  const { 
    deals, 
    isLoading, 
    error, 
    editingDeal, 
    setEditingDeal, 
    setDeletingDeal,
    handleUpdate,
    handleCreate,
    refetch
  } = dealManagement;

  const {
    handleViewDiscountCodes,
    handleCloseDiscountCodesDialog,
    handleEditDeal,
    handleCloseDealDialog,
    handleUpdateDeal,
    handleGenerateDiscountCodes
  } = useDealHandlers(
    setViewingCodesForDeal,
    setEditingDeal,
    setIsDialogOpen,
    handleUpdate,
    refetch,
    isProcessingAction,
    setIsProcessingAction,
    isGeneratingCodes,
    setIsGeneratingCodes,
    setIsClosingCodesDialog
  );

  // Handle creating a new deal
  const handleCreateDeal = useCallback(() => {
    setEditingDeal(null); 
    setIsDialogOpen(true);
    console.log("[SalonDeals] Creating new deal, dialog opened");
  }, [setEditingDeal, setIsDialogOpen]);

  // Handle form submission for a new deal - Changed to have void return type
  const handleCreateSubmit = useCallback(async (values: FormValues): Promise<void> => {
    if (isProcessingAction) {
      return;
    }
    
    try {
      setIsProcessingAction(true);
      console.log("[SalonDeals] Submitting new deal creation");
      
      if (!handleCreate) {
        toast.error("Kunde inte skapa erbjudandet: Funktionen är inte tillgänglig");
        return;
      }
      
      const success = await handleCreate(values);
      if (success) {
        toast.success("Erbjudandet har skapats!");
        setIsDialogOpen(false);
        await refetch();
      }
    } catch (error) {
      console.error("[SalonDeals] Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
    } finally {
      setIsProcessingAction(false);
    }
  }, [isProcessingAction, setIsProcessingAction, handleCreate, setIsDialogOpen, refetch]);

  return (
    <SalonLayout>
      <Helmet>
        <title>Erbjudanden | Min Salong</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Hantera Erbjudanden</h1>
          <Button 
            onClick={handleCreateDeal} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Skapa erbjudande
          </Button>
        </div>
        
        <SalonDealsContent
          deals={deals}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditDeal}
          onDelete={setDeletingDeal}
          onViewDiscountCodes={handleViewDiscountCodes}
          onGenerateDiscountCodes={handleGenerateDiscountCodes}
          isGeneratingCodes={isGeneratingCodes}
        />

        <SalonDealsDialogs
          editingDeal={editingDeal}
          isDialogOpen={isDialogOpen}
          onCloseDealDialog={handleCloseDealDialog}
          onUpdateDeal={handleUpdateDeal}
          viewingCodesForDeal={viewingCodesForDeal}
          isClosingCodesDialog={isClosingCodesDialog}
          onCloseDiscountCodesDialog={handleCloseDiscountCodesDialog}
          onGenerateDiscountCodes={handleGenerateDiscountCodes}
        />
      </div>
    </SalonLayout>
  );
};
