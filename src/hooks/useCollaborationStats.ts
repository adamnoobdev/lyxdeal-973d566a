
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { useMemo } from "react";

// Definiera en helt fristående typ utan koppling till supabase-typerna
type PendingApplication = {
  id: string;
  collaboration_id: string;
  creator_id: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  salon_id: number;
}

// Interface för statistik
interface CollaborationStats {
  totalViews: number;
  totalRedemptions: number;
  activeCollaborators: number;
  pendingApplications: number;
}

export function useCollaborationStats(salonId: number | undefined, collaborations: ActiveCollaboration[]) {
  // Använd en helt annan strategi för att hämta pendingApplications
  const { data: pendingApplicationsData, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['salon-pending-applications', salonId],
    queryFn: async () => {
      if (!salonId) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('collaboration_applications')
          .select('*')
          .eq('status', 'pending')
          .eq('salon_id', salonId);
          
        if (error) {
          throw error;
        }
        
        // Behandla data innan den returneras för att bryta typ-kedjan
        const formattedData = Array.isArray(data) ? data.map((item): PendingApplication => ({
          id: item.id || '',
          collaboration_id: item.collaboration_id || '',
          creator_id: item.creator_id || '',
          message: item.message,
          status: item.status || 'pending',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          salon_id: item.salon_id || 0
        })) : [];
        
        return formattedData;
      } catch (error) {
        console.error('Error fetching pending applications:', error);
        return [];
      }
    },
    enabled: !!salonId
  });
  
  // Säkerställ att vi alltid har en array
  const pendingApplications = pendingApplicationsData || [];
  
  // Beräkna statistik
  const stats: CollaborationStats = useMemo(() => {
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
