
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
  const { data: pendingApplicationsData, isLoading: isLoadingApplications, error: applicationsError } = useQuery({
    queryKey: ['salon-pending-applications', salonId],
    queryFn: async () => {
      if (!salonId) {
        console.log("Cannot fetch pending applications: No salon ID provided");
        return [] as PendingApplication[];
      }
      
      try {
        console.log(`Fetching pending applications for salon ID: ${salonId}`);
        
        // Use a standard query approach instead of an RPC call
        const { data, error } = await supabase
          .from('collaboration_applications')
          .select('id, collaboration_id, creator_id, message, status, created_at, updated_at')
          .eq('status', 'pending');
          
        if (error) {
          console.error('Error fetching pending applications:', error);
          return [] as PendingApplication[];
        }
        
        console.log(`Found ${data?.length || 0} pending applications`);
        
        // Explicitly cast and map to our standalone type
        const applications = (Array.isArray(data) ? data : []).map((item: any): PendingApplication => ({
          id: item.id || '',
          collaboration_id: item.collaboration_id || '',
          creator_id: item.creator_id || '',
          message: item.message,
          status: item.status || 'pending',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          salon_id: salonId // Add salon_id from the parameter since it's not in the query result
        }));
        
        return applications;
      } catch (error) {
        console.error('Error in pending applications query:', error);
        return [] as PendingApplication[];
      }
    },
    enabled: !!salonId,
    staleTime: 60000 // Cache data for 1 minute to reduce unnecessary requests
  });
  
  // Ensure we always have an array with the correct type
  const pendingApplications: PendingApplication[] = pendingApplicationsData || [];
  
  // Calculate statistics with error handling
  const stats: CollaborationStats = useMemo(() => {
    try {
      // Default values if there's an error
      const defaultStats: CollaborationStats = {
        totalViews: 0,
        totalRedemptions: 0,
        activeCollaborators: 0,
        pendingApplications: 0
      };
      
      // Check for valid data
      if (!Array.isArray(collaborations)) {
        console.error('Invalid collaborations data format:', collaborations);
        return defaultStats;
      }
      
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
    } catch (error) {
      console.error('Error calculating collaboration statistics:', error);
      return {
        totalViews: 0,
        totalRedemptions: 0,
        activeCollaborators: 0,
        pendingApplications: 0
      };
    }
  }, [collaborations, pendingApplications]);
  
  return {
    stats,
    isLoading: isLoadingApplications,
    error: applicationsError
  };
}
