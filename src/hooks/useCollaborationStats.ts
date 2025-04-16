
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { useMemo } from "react";

// Define a type for the pending applications that matches the actual data structure
type PendingApplication = {
  id: string;
  collaboration_id: string;
  creator_id: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useCollaborationStats(salonId: number | undefined, collaborations: ActiveCollaboration[]) {
  // Hämta pendingApplications från API
  const { data: pendingApplications = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ['salon-pending-applications', salonId],
    queryFn: async () => {
      if (!salonId) return [];
      
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select('*')
        .eq('status', 'pending')
        .eq('salon_id', salonId);
        
      if (error) throw error;
      return (data || []) as PendingApplication[];
    },
    enabled: !!salonId
  });

  // Beräkna statistik från collaborations-arrayen
  const stats = useMemo(() => {
    const totalViews = collaborations.reduce((sum, collab) => sum + (collab.views || 0), 0);
    const totalRedemptions = collaborations.reduce((sum, collab) => sum + (collab.redemptions || 0), 0);
    
    // Räkna unika kreatörer (baserat på creator_id)
    const uniqueCreatorIds = new Set(collaborations.map(collab => collab.creator_id));
    const activeCollaborators = uniqueCreatorIds.size;
    
    return {
      totalViews,
      totalRedemptions,
      activeCollaborators,
      pendingApplications: pendingApplications.length
    };
  }, [collaborations, pendingApplications]);
  
  return {
    stats,
    isLoading: isLoadingApplications
  };
}
