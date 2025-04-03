
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
  
  // Fetch salon ID for current user
  useEffect(() => {
    const fetchSalonId = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        // Convert the numeric salon ID to string to match the expected state type
        setSalonId(data.id.toString());
      } catch (err) {
        console.error("Error fetching salon ID:", err);
      }
    };
    
    fetchSalonId();
  }, [session?.user?.id]);
  
  // Get deal management functionality
  const dealManagement = useSalonDealsManagement(salonId);
  
  useEffect(() => {
    if (!dealManagement.editingDeal && isDialogOpen) {
      setIsDialogOpen(false);
    } else if (dealManagement.editingDeal && !isDialogOpen) {
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
    setIsClosingCodesDialog
  };
};
