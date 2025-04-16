
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { useMemo } from "react";

// Define a completely standalone type without connection to Supabase types
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

// Interface for statistics
interface CollaborationStats {
  totalViews: number;
  totalRedemptions: number;
  activeCollaborators: number;
  pendingApplications: number;
}

export function useCollaborationStats(salonId: number | undefined, collaborations: ActiveCollaboration[]) {
  // Fetch pending applications using a simpler approach
  const { data: pendingApplicationsData, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['salon-pending-applications', salonId],
    queryFn: async () => {
      if (!salonId) {
        return [] as PendingApplication[];
      }
      
      try {
        // Use a raw query approach to avoid TypeScript inference issues
        const { data, error } = await supabase
          .rpc('get_pending_applications', { salon_id_param: salonId });
          
        if (error) {
          console.error('Error fetching pending applications:', error);
          return [] as PendingApplication[];
        }
        
        // Convert raw data to our type
        return (Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.id || '',
          collaboration_id: item.collaboration_id || '',
          creator_id: item.creator_id || '',
          message: item.message,
          status: item.status || 'pending',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          salon_id: item.salon_id || 0
        })) as PendingApplication[];
      } catch (error) {
        console.error('Error in pending applications query:', error);
        return [] as PendingApplication[];
      }
    },
    enabled: !!salonId
  });
  
  // Ensure we always have an array with the correct type
  const pendingApplications: PendingApplication[] = pendingApplicationsData || [];
  
  // Calculate statistics
  const stats: CollaborationStats = useMemo(() => {
    const totalViews = collaborations.reduce((sum, collab) => sum + (collab.views || 0), 0);
    const totalRedemptions = collaborations.reduce((sum, collab) => sum + (collab.redemptions || 0), 0);
    
    // Count unique creators (based on creator_id)
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
