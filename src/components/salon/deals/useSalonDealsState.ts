
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSalonDealsManagement } from "@/hooks/salon-deals-management";
import { Deal } from "@/components/admin/types";
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
        console.log("Starting to fetch salon ID, current URL salonId:", urlSalonId);
        
        if (!urlSalonId) {
          const { data: { session } } = await supabase.auth.getSession();
          console.log("Auth session:", session ? "exists" : "does not exist");
          
          if (session?.user?.id) {
            console.log("User ID from session:", session.user.id);
            
            const { data: salonData, error } = await supabase
              .from('salons')
              .select('id')
              .eq('user_id', session.user.id)
              .single();

            if (error) {
              console.error("Error fetching salon ID:", error);
              // Consider redirecting to error page or showing toast notification
            } else if (salonData) {
              console.log("Setting salon ID from user session:", salonData.id);
              setSalonId(salonData.id.toString());
            } else {
              console.error("No salon found for user ID:", session.user.id);
              // Consider redirecting to create salon page or showing toast notification
            }
          } else {
            console.error("No user session found");
            // Consider redirecting to login page
          }
        } else {
          console.log("Using salon ID from URL:", urlSalonId);
        }
      } catch (error) {
        console.error("Error in fetchUserSalonId:", error);
      }
    };

    if (!salonId) {
      console.log("No salonId state, attempting to fetch");
      fetchUserSalonId();
    } else {
      console.log("Using existing salonId state:", salonId);
    }
  }, [urlSalonId, salonId]);

  // Log salon ID changes
  useEffect(() => {
    console.log("useSalonDealsState - Current salon ID:", salonId);
  }, [salonId]);

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
