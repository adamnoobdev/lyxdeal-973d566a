
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSalonDealsManagement } from "@/hooks/useSalonDealsManagement";
import { Deal } from "@/components/admin/types";
import { useSalon } from "@/hooks/useSalon";
import { supabase } from "@/integrations/supabase/client";

export const useSalonDealsState = () => {
  const { salonId: urlSalonId } = useParams<{ salonId?: string }>();
  const [salonId, setSalonId] = useState<string | undefined>(urlSalonId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  // Fetch the salon ID for the currently logged in user if not provided in URL
  useEffect(() => {
    const fetchUserSalonId = async () => {
      try {
        if (!urlSalonId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            const { data: salonData, error } = await supabase
              .from('salons')
              .select('id')
              .eq('user_id', session.user.id)
              .single();

            if (error) {
              console.error("Error fetching salon ID:", error);
            } else if (salonData) {
              console.log("Setting salon ID from user session:", salonData.id);
              setSalonId(salonData.id.toString());
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchUserSalonId:", error);
      }
    };

    if (!salonId) {
      fetchUserSalonId();
    }
  }, [urlSalonId, salonId]);

  const dealManagement = useSalonDealsManagement(salonId);

  return {
    dealManagement,
    isDialogOpen,
    setIsDialogOpen,
    editingDeal,
    setEditingDeal,
    viewingCodesForDeal,
    setViewingCodesForDeal,
    isClosingCodesDialog,
    setIsClosingCodesDialog,
    isGeneratingCodes,
    setIsGeneratingCodes,
    salonId
  };
};
