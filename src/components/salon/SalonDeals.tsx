
import React, { useState, useEffect } from 'react';
import { SalonDealsContent } from '@/components/salon/deals/SalonDealsContent';
import { SalonDealsDialogs } from '@/components/salon/deals/SalonDealsDialogs';
import { useSalonDealsState } from '@/components/salon/deals/useSalonDealsState';
import { toast } from 'sonner';

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

  // Logga salonId för att felsöka problem
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
          try {
            const success = await dealManagement.handleUpdate(values);
            if (success === false) { // Check explicitly against false
              toast.error("Det gick inte att uppdatera erbjudandet. Kontrollera att alla fält är korrekt ifyllda.");
            }
          } catch (error) {
            console.error("Error updating deal:", error);
            toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
          }
        }}
        onCreate={async (values) => {
          try {
            console.log("Attempting to create new deal with values:", {
              ...values,
              salon_id: salonId
            });
            
            // Ensure salon_id is included in the values
            if (dealManagement.handleCreate) {
              const success = await dealManagement.handleCreate({
                ...values,
                salon_id: parseInt(salonId || "0", 10)
              });
              
              if (success === false) { // Check explicitly against false
                toast.error("Det gick inte att skapa erbjudandet. Kontrollera att alla fält är korrekt ifyllda.");
              }
            } else {
              console.error("handleCreate function not available in dealManagement");
              toast.error("Ett systemfel uppstod. Kontakta support.");
            }
          } catch (error) {
            console.error("Error creating deal:", error);
            toast.error("Ett fel uppstod när erbjudandet skulle skapas");
          }
        }}
      />
    </>
  );
};
