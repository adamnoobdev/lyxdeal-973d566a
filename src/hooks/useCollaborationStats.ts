
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { useMemo } from "react";

// Definiera en enklare typ för PendingApplication som bryter kopplingen till den djupa typinferensen
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

// Interface för statistik för att göra koden tydligare
interface CollaborationStats {
  totalViews: number;
  totalRedemptions: number;
  activeCollaborators: number;
  pendingApplications: number;
}

export function useCollaborationStats(salonId: number | undefined, collaborations: ActiveCollaboration[]) {
  // Hämta pendingApplications från API, med förenklad typhantering
  const { data, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['salon-pending-applications', salonId],
    queryFn: async () => {
      if (!salonId) return [] as PendingApplication[];
      
      // Använd ett mer direkt angreppssätt för att hämta data och hantera typer
      const response = await supabase
        .from('collaboration_applications')
        .select('*')
        .eq('status', 'pending')
        .eq('salon_id', salonId);
        
      if (response.error) throw response.error;
      
      // Explicit typkonvertering för att undvika djup typinferens
      return (response.data || []) as PendingApplication[];
    },
    enabled: !!salonId
  });

  // Använd pendingApplications med säker fallback
  const pendingApplications = data || [];
  
  // Beräkna statistik från collaborations-arrayen
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
