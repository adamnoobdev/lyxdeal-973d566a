
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

      console.log(`Fetching collaboration requests for salon ID: ${salonId}`);
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select('*')
        .eq('salon_id', salonId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaboration requests:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} collaboration requests`);
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

      console.log(`Fetching active collaborations for salon ID: ${salonId}`);
      const { data, error } = await supabase
        .from('active_collaborations')
        .select('*')
        .eq('salon_id', salonId);

      if (error) {
        console.error('Error fetching active collaborations:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} active collaborations`);
      
      // Enkel berikning av data
      const enrichedData = await Promise.all(data.map(async (collab) => {
        try {
          // Hämta salongnamn
          const { data: salonData } = await supabase
            .from('salons')
            .select('name')
            .eq('id', collab.salon_id)
            .single();
            
          // Hämta dealinformation
          const { data: dealData } = await supabase
            .from('deals')
            .select('title')
            .eq('id', collab.deal_id)
            .single();
            
          return {
            ...collab,
            salon_name: salonData?.name || 'Okänd salong',
            deal_title: dealData?.title || 'Okänd behandling',
          } as ActiveCollaboration;
        } catch (err) {
          console.warn('Error enriching collaboration:', err);
          return collab as ActiveCollaboration;
        }
      }));
      
      return enrichedData;
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
