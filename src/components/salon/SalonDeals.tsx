import React, { useState, useEffect, useCallback } from 'react';
import { SalonDealsContent } from '@/components/salon/deals/SalonDealsContent';
import { SalonDealsDialogs } from '@/components/salon/deals/SalonDealsDialogs';
import { useSalonDealsState } from '@/components/salon/deals/useSalonDealsState';
import { toast } from 'sonner';
import { createDeal } from '@/utils/deal/queries/createDeal';
import { deleteDeal } from '@/utils/deal/queries/deleteDeal';
import { supabase } from '@/integrations/supabase/client';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingDeal, setDeletingDeal] = useState<any>(null);

  const [currentSalonId, setCurrentSalonId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchSalonId = async () => {
      if (salonId) {
        setCurrentSalonId(parseInt(salonId, 10));
        return;
      }
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;
        
        const { data: salonData } = await supabase
          .from('salons')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
          
        if (salonData?.id) {
          console.log("[SalonDeals] Fetched salon ID:", salonData.id);
          setCurrentSalonId(salonData.id);
        }
      } catch (error) {
        console.error("[SalonDeals] Error fetching salon ID:", error);
      }
    };
    
    fetchSalonId();
  }, [salonId]);

  useEffect(() => {
    if (initialCreateDialogOpen && !isDialogOpen) {
      setIsDialogOpen(true);
    }
  }, [initialCreateDialogOpen, isDialogOpen, setIsDialogOpen]);

  const handleCloseDialog = useCallback(() => {
    if (isSubmitting) return;
    
    setIsDialogOpen(false);
    setEditingDeal(null);
    if (onCloseCreateDialog) {
      onCloseCreateDialog();
    }
  }, [isSubmitting, setIsDialogOpen, setEditingDeal, onCloseCreateDialog]);

  const handleDeleteDeal = async () => {
    if (!deletingDeal || isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log("[SalonDeals] Deleting deal:", deletingDeal.id);
      
      const success = await deleteDeal(deletingDeal.id);
      
      if (success) {
        console.log("[SalonDeals] Deal deleted successfully");
        await dealManagement.refetch();
      }
    } catch (error) {
      console.error("[SalonDeals] Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
    } finally {
      setIsDeleting(false);
      setDeletingDeal(null);
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

  const handleCreateDeal = async (values: any) => {
    console.log("[SalonDeals] Create deal called with values:", values);
    setIsSubmitting(true);
    
    try {
      const finalSalonId = values.salon_id || currentSalonId;
      if (!finalSalonId) {
        console.error("[SalonDeals] No salon ID available");
        toast.error("Kunde inte identifiera salongen. Vänligen försök igen.");
        setIsSubmitting(false);
        return false;
      }
      
      values.salon_id = finalSalonId;
      console.log("[SalonDeals] Creating deal with salon ID:", finalSalonId);
      
      const success = await createDeal(values);
      
      if (success) {
        console.log("[SalonDeals] Deal created successfully");
        toast.success("Erbjudandet har skapats!");
        await dealManagement.refetch();
        setIsSubmitting(false);
        return true;
      } else {
        console.error("[SalonDeals] Failed to create deal");
        toast.error("Det gick inte att skapa erbjudandet. Kontrollera att alla fält är korrekt ifyllda.");
        setIsSubmitting(false);
        return false;
      }
    } catch (error) {
      console.error("[SalonDeals] Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas");
      setIsSubmitting(false);
      return false;
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
        onDelete={deal => {
          setDeletingDeal(deal);
        }}
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
          deletingDeal,
          setDeletingDeal,
          handleDelete: handleDeleteDeal
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
            setIsSubmitting(true);
            const success = await dealManagement.handleUpdate(values);
            setIsSubmitting(false);
            
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
            setIsSubmitting(false);
            return false;
          }
        }}
        onCreate={handleCreateDeal}
      />
    </>
  );
};
