
import React, { useState } from 'react';
import { SalonDealsContent } from '@/components/salon/deals/SalonDealsContent';
import { SalonDealsDialogs } from '@/components/salon/deals/SalonDealsDialogs';
import { useSalonDealsState } from '@/components/salon/deals/useSalonDealsState';

export const SalonDeals: React.FC = () => {
  const {
    dealManagement,
    viewingCodesForDeal,
    setViewingCodesForDeal,
    isGeneratingCodes,
    setIsGeneratingCodes,
    isDialogOpen,
    setIsDialogOpen,
    isClosingCodesDialog,
    setIsClosingCodesDialog,
    editingDeal,
    setEditingDeal
  } = useSalonDealsState();

  const handleGenerateDiscountCodes = async (deal: any, quantity: number) => {
    try {
      setIsGeneratingCodes(true);
      // We've removed Stripe integration but kept the function for API compatibility
      console.log(`Generating ${quantity} discount codes for deal ${deal.id}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      await dealManagement.refetch(); // Refresh data
      return true;
    } catch (error) {
      console.error("Error generating discount codes:", error);
      return false;
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  return (
    <>
      <SalonDealsContent
        deals={dealManagement.deals}
        isLoading={dealManagement.isLoading}
        error={dealManagement.error}
        onEdit={deal => {
          setEditingDeal(deal);
          setIsDialogOpen(true);
        }}
        onDelete={dealManagement.setDeletingDeal}
        onViewDiscountCodes={setViewingCodesForDeal}
        onGenerateDiscountCodes={handleGenerateDiscountCodes}
        isGeneratingCodes={isGeneratingCodes}
      />
      
      <SalonDealsDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingDeal={editingDeal}
        setEditingDeal={setEditingDeal}
        deleteData={{
          deletingDeal: dealManagement.deletingDeal,
          setDeletingDeal: dealManagement.setDeletingDeal,
          handleDelete: dealManagement.handleDelete
        }}
        codeData={{
          viewingCodesForDeal,
          setViewingCodesForDeal,
          isClosingCodesDialog,
          setIsClosingCodesDialog
        }}
        onUpdate={dealManagement.handleUpdate}
        onCreate={dealManagement.handleCreate}
      />
    </>
  );
};
