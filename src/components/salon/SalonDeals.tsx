
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

  const [lastError, setLastError] = useState<string | null>(null);

  // Logga salonId för att felsöka problem
  useEffect(() => {
    console.log("SalonDeals component - Current salon ID:", salonId);
    console.log("SalonDeals component - handleCreate available:", !!dealManagement.handleCreate);
  }, [salonId, dealManagement.handleCreate]);

  // Synchronize dialog state with external control
  useEffect(() => {
    if (initialCreateDialogOpen && !isDialogOpen) {
      setIsDialogOpen(true);
    }
  }, [initialCreateDialogOpen, isDialogOpen, setIsDialogOpen]);

  // When dialog closes, notify parent component
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDeal(null);
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
            console.log("Attempting to update deal with values:", values);
            const success = await dealManagement.handleUpdate(values);
            // Check specifically if success is false (not just any falsy value)
            if (success === false) {
              const errorMsg = "Det gick inte att uppdatera erbjudandet. Kontrollera att alla fält är korrekt ifyllda.";
              toast.error(errorMsg);
              setLastError(errorMsg);
              return false;
            }
            setLastError(null);
            return success;
          } catch (error) {
            console.error("Error updating deal:", error);
            const errorMsg = "Ett fel uppstod när erbjudandet skulle uppdateras";
            toast.error(errorMsg);
            setLastError(errorMsg);
            return false;
          }
        }}
        onCreate={async (values) => {
          try {
            console.log("Attempting to create new deal with salonId:", salonId);
            
            if (!dealManagement.handleCreate) {
              const errorMsg = "handleCreate function not available in dealManagement";
              console.error(errorMsg);
              toast.error("Ett systemfel uppstod. Kontakta support.");
              setLastError(errorMsg);
              return false;
            }
            
            if (!salonId && !values.salon_id) {
              const errorMsg = "No salon ID available";
              console.error(errorMsg);
              toast.error("Kunde inte identifiera salongen.");
              setLastError(errorMsg);
              return false;
            }
            
            // Ensure salon_id is included in the values
            const formValues = {
              ...values,
              salon_id: values.salon_id || parseInt(salonId!, 10)
            };
            
            console.log("Calling handleCreate with values:", formValues);
            const success = await dealManagement.handleCreate(formValues);
            
            if (success === false) {
              const errorMsg = "Failed to create deal";
              console.error(errorMsg);
              toast.error("Det gick inte att skapa erbjudandet. Kontrollera att alla fält är korrekt ifyllda.");
              setLastError(errorMsg);
              return false;
            }
            
            setLastError(null);
            return success;
          } catch (error) {
            console.error("Error creating deal:", error);
            const errorMsg = "Ett fel uppstod när erbjudandet skulle skapas";
            toast.error(errorMsg);
            setLastError(errorMsg);
            return false;
          }
        }}
      />
    </>
  );
};
