
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration, CollaborationRequest } from "@/types/collaboration";

export function useSalonCollaborations(salonId: number | undefined) {
  const {
    data: collaborationRequests = [],
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['salon-collaboration-requests', salonId],
    queryFn: async () => {
      if (!salonId) return [];

      const { data, error } = await supabase
        .from('collaboration_requests')
        .select('*')
        .eq('salon_id', salonId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CollaborationRequest[];
    },
    enabled: !!salonId
  });

  const {
    data: activeCollaborations = [],
    isLoading: isLoadingCollaborations,
    error: collaborationsError,
    refetch: refetchCollaborations
  } = useQuery({
    queryKey: ['salon-active-collaborations', salonId],
    queryFn: async () => {
      if (!salonId) return [];

      const { data, error } = await supabase
        .from('active_collaborations')
        .select(`
          *,
          collaboration_id,
          creator_id
        `)
        .eq('salon_id', salonId);

      if (error) throw error;
      return data as ActiveCollaboration[];
    },
    enabled: !!salonId
  });

  // Kombinera refetch-funktioner
  const refetch = async () => {
    await Promise.all([refetchRequests(), refetchCollaborations()]);
  };

  return {
    collaborationRequests,
    activeCollaborations,
    collaborations: [...activeCollaborations],
    isLoading: isLoadingRequests || isLoadingCollaborations,
    error: requestsError || collaborationsError,
    refetch
  };
}
