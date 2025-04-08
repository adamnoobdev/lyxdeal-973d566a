import { useState, useCallback, useEffect } from 'react';
import { Deal } from '@/components/admin/types';
import { useSalonDealsManagement } from '@/hooks/salon-deals-management';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';

export const useSalonDealsState = () => {
  const { session } = useSession();
  const [salonId, setSalonId] = useState<string | undefined>(undefined);
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  
  // Fetch salon ID for current user
  useEffect(() => {
    const fetchSalonId = async () => {
      if (!session?.user?.id) return;
      
      try {
        console.log("Fetching salon ID for user:", session.user.id);
        const { data, error } = await supabase
          .from('salons')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching salon ID:", error);
          throw error;
        }
        
        if (data) {
          // Convert the numeric salon ID to string to match the expected state type
          const id = data.id.toString();
          console.log("Found salon ID:", id);
          setSalonId(id);
        } else {
          console.error("No salon found for user");
        }
      } catch (err) {
        console.error("Error in fetchSalonId:", err);
      }
    };
    
    fetchSalonId();
  }, [session?.user?.id]);
  
  // Get deal management functionality
  const dealManagement = useSalonDealsManagement(salonId);
  
  // Keep isDialogOpen synchronized with editingDeal in one direction
  // If editingDeal exists, open the dialog
  // If editingDeal becomes null, don't automatically close the dialog
  useEffect(() => {
    if (dealManagement.editingDeal && !isDialogOpen) {
      setIsDialogOpen(true);
    }
  }, [dealManagement.editingDeal, isDialogOpen]);

  return {
    salonId,
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
    setIsClosingCodesDialog,
    editingDeal,
    setEditingDeal
  };
};
