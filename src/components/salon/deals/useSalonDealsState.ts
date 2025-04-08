
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Deal } from '@/components/admin/types';
import { useSalonDealsManagement } from '@/hooks/salon-deals-management';
import { supabase } from '@/integrations/supabase/client';

export const useSalonDealsState = () => {
  const { salonId: urlSalonId } = useParams<{ salonId?: string }>();
  const [salonId, setSalonId] = useState<string | undefined>(urlSalonId);
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Om salonId inte kom från URL, försök hämta det från den inloggade användaren
  useEffect(() => {
    async function getSalonIdFromUser() {
      if (salonId) return; // Redan har ett salon ID

      try {
        console.log("Fetching salon ID from user session");
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.id) {
          const { data: salonData } = await supabase
            .from('salons')
            .select('id')
            .eq('user_id', sessionData.session.user.id)
            .single();

          if (salonData?.id) {
            console.log("Found salon ID from user session:", salonData.id);
            setSalonId(salonData.id.toString());
          } else {
            console.error("No salon found for logged in user");
          }
        } else {
          console.error("No active user session found");
        }
      } catch (error) {
        console.error("Error fetching salon ID:", error);
      }
    }

    getSalonIdFromUser();
  }, [salonId]);

  // Använd dealManagement hook för att hantera deals
  const dealManagement = useSalonDealsManagement(salonId);

  // Debug logging
  useEffect(() => {
    console.log("useSalonDealsState - Current salon ID:", salonId);
    console.log("useSalonDealsState - handleCreate available:", !!dealManagement.handleCreate);
  }, [salonId, dealManagement]);

  return {
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
  };
};
