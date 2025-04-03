
import React from 'react';
import { SalonLayout } from './layout/SalonLayout';
import { useSalonDealsState } from './deals/useSalonDealsState';
import { useDealHandlers } from './deals/useDealHandlers';
import { SalonDealsContent } from './deals/SalonDealsContent';
import { SalonDealsDialogs } from './deals/SalonDealsDialogs';

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

  return (
    <SalonLayout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Hantera Erbjudanden</h1>
        
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
