
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  
  const isMountedRef = useRef(true);
  const deleteInProgressRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  const safeTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };
  
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const addLog = useCallback((message: string) => {
    console.log(`[SalonDeals] ${message}`);
    if (isMountedRef.current) {
      setOperationLog(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
    }
  }, []);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);
  
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
          addLog(`Fetched salon ID: ${salonData.id}`);
          setCurrentSalonId(salonData.id);
        }
      } catch (error) {
        console.error("[SalonDeals] Error fetching salon ID:", error);
      }
    };
    
    fetchSalonId();
  }, [salonId, addLog]);

  useEffect(() => {
    if (initialCreateDialogOpen && !isDialogOpen) {
      setIsDialogOpen(true);
    }
  }, [initialCreateDialogOpen, isDialogOpen, setIsDialogOpen]);

  const handleCloseDialog = useCallback(() => {
    if (isSubmitting) {
      addLog("Dialog close requested but submission in progress, ignoring");
      return;
    }
    
    addLog("Closing main dialog");
    setIsDialogOpen(false);
    
    safeTimeout(() => {
      setEditingDeal(null);
      if (onCloseCreateDialog) {
        onCloseCreateDialog();
      }
    }, 300);
  }, [isSubmitting, setIsDialogOpen, setEditingDeal, onCloseCreateDialog, addLog]);

  const handleDeleteDeal = useCallback(async () => {
    if (!deletingDeal || isDeleting || deleteInProgressRef.current) {
      addLog("Delete requested but no deal selected or delete already in progress");
      return;
    }
    
    try {
      setIsDeleting(true);
      deleteInProgressRef.current = true;
      
      addLog(`Deleting deal: ${deletingDeal.id}`);
      
      const success = await deleteDeal(deletingDeal.id);
      
      if (success) {
        addLog("Deal deleted successfully");
        toast.success("Erbjudandet har tagits bort");
        
        // Immediately update local state to reflect deletion before refetching
        dealManagement.refetch();
      } else {
        addLog("Delete operation returned false");
        toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
      }
    } catch (error) {
      console.error("[SalonDeals] Error deleting deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
    } finally {
      safeTimeout(() => {
        if (isMountedRef.current) {
          setIsDeleting(false);
          setDeletingDeal(null);
          deleteInProgressRef.current = false;
        }
      }, 300);
    }
  }, [deletingDeal, isDeleting, dealManagement, addLog]);

  const handleGenerateDiscountCodes = async (deal: any, quantity: number): Promise<void> => {
    try {
      setIsGeneratingCodes(true);
      addLog(`Generating ${quantity} discount codes for deal ID ${deal.id}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      await dealManagement.refetch(); // Refresh data
    } catch (error) {
      console.error("Error generating discount codes:", error);
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  const handleCreateDeal = async (values: any) => {
    addLog("Create deal called with values");
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
      
      // Om vi är en salong som skickar in ett erbjudande efter avslag, sätt tillbaka status till pending
      if (editingDeal && editingDeal.status === 'rejected') {
        // Add the status field to values object if it doesn't exist
        if (!values.status) {
          values.status = 'pending';
        } else {
          values.status = 'pending';
        }
        
        toast.info("Ditt korrigerade erbjudande kommer att granskas på nytt", {
          description: "Du får en notifikation när det har blivit godkänt eller nekat"
        });
      }
      
      addLog(`Creating/updating deal with salon ID: ${finalSalonId}`);
      
      let success;
      
      if (editingDeal) {
        // Uppdatera befintligt erbjudande
        success = await dealManagement.handleUpdate(values);
      } else {
        // Skapa nytt erbjudande
        success = await createDeal(values);
      }
      
      if (success) {
        addLog("Deal created/updated successfully");
        toast.success(editingDeal 
          ? "Erbjudandet har uppdaterats!" 
          : "Erbjudandet har skapats!"
        );
        await dealManagement.refetch();
        
        safeTimeout(() => {
          setIsSubmitting(false);
        }, 300);
        return true;
      } else {
        console.error("[SalonDeals] Failed to create/update deal");
        toast.error("Det gick inte att spara erbjudandet. Kontrollera att alla fält är korrekt ifyllda.");
        setIsSubmitting(false);
        return false;
      }
    } catch (error) {
      console.error("[SalonDeals] Error creating/updating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle sparas");
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
          addLog(`Edit requested for deal: ${deal.id}`);
          setEditingDeal(deal);
          setIsDialogOpen(true);
        }}
        onDelete={deal => {
          addLog(`Delete requested for deal: ${deal.id}`);
          setDeletingDeal(deal);
        }}
        onViewDiscountCodes={deal => {
          addLog(`View codes requested for deal: ${deal.id}`);
          setViewingCodesForDeal(deal);
        }}
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
            addLog("Update deal requested");
            setIsSubmitting(true);
            
            // Återställ status till pending om erbjudandet var avslaget
            if (editingDeal && editingDeal.status === 'rejected') {
              // Add the status field to values object if it doesn't exist
              values.status = 'pending';
            }
            
            const success = await handleCreateDeal(values);
            
            safeTimeout(() => {
              if (isMountedRef.current) {
                setIsSubmitting(false);
              }
            }, 300);
            
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
            
            safeTimeout(() => {
              if (isMountedRef.current) {
                setIsSubmitting(false);
              }
            }, 100);
            
            return false;
          }
        }}
        onCreate={handleCreateDeal}
      />
    </>
  );
};
