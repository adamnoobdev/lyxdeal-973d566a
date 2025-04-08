
import React, { useState, useEffect } from 'react';
import { SalonDealsContent } from '@/components/salon/deals/SalonDealsContent';
import { SalonDealsDialogs } from '@/components/salon/deals/SalonDealsDialogs';
import { useSalonDealsState } from '@/components/salon/deals/useSalonDealsState';

interface SalonDealsProps {
  initialCreateDialogOpen?: boolean;
  onCloseCreateDialog?: () => void;
}

export const SalonDeals: React.FC<SalonDealsProps> = ({ 
  initialCreateDialogOpen = false,
  onCloseCreateDialog
}) => {
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
    setEditingDeal,
    salonId
  } = useSalonDealsState();

  // Log the salonId to debug issues
  useEffect(() => {
    console.log("SalonDeals component - Current salon ID:", salonId);
  }, [salonId]);

  // Synchronize dialog state with external control
  useEffect(() => {
    if (initialCreateDialogOpen && !isDialogOpen) {
      setIsDialogOpen(true);
    }
  }, [initialCreateDialogOpen, isDialogOpen, setIsDialogOpen]);

  // When dialog closes, notify parent component
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    if (onCloseCreateDialog) {
      onCloseCreateDialog();
    }
  };

  const handleGenerateDiscountCodes = async (deal: any, quantity: number): Promise<void> => {
    try {
      setIsGeneratingCodes(true);
      console.log(`Generating ${quantity} discount codes for deal ${deal.id}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      await dealManagement.refetch(); // Refresh data
    } catch (error) {
      console.error("Error generating discount codes:", error);
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
        setIsDialogOpen={handleCloseDialog}
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
        onUpdate={async (values) => {
          const success = await dealManagement.handleUpdate(values);
          return;
        }}
        onCreate={async (values) => {
          console.log("Attempting to create new deal with values:", {
            ...values,
            salon_id: salonId
          });
          // Ensure salon_id is included in the values
          const success = await dealManagement.handleCreate({
            ...values,
            salon_id: parseInt(salonId || "0", 10)
          });
          return;
        }}
      />
    </>
  );
};
