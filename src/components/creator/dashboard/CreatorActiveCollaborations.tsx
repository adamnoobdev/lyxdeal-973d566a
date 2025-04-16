
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { CollaborationCard } from "@/components/creator/dashboard/CollaborationCard";
import { Loader2 } from "lucide-react";

export const CreatorActiveCollaborations = () => {
  const [collaborations, setCollaborations] = useState<ActiveCollaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error('Ej inloggad');

        // Hämta användarens aktiva samarbeten
        const { data, error } = await supabase
          .from('active_collaborations')
          .select(`
            id,
            collaboration_id,
            creator_id,
            salon_id,
            deal_id,
            discount_code,
            views,
            redemptions,
            created_at,
            collaboration_requests:collaboration_id (
              title,
              description,
              compensation
            ),
            salons:salon_id (
              name
            ),
            deals:deal_id (
              title,
              description,
              booking_url
            )
          `)
          .eq('creator_id', authData.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transformera datan till rätt format
        const transformedData: ActiveCollaboration[] = data.map(item => ({
          id: item.id,
          collaboration_id: item.collaboration_id,
          creator_id: item.creator_id,
          salon_id: item.salon_id,
          deal_id: item.deal_id,
          discount_code: item.discount_code,
          views: item.views,
          redemptions: item.redemptions,
          created_at: item.created_at,
          collaboration_title: item.collaboration_requests?.title,
          collaboration_description: item.collaboration_requests?.description,
          compensation: item.collaboration_requests?.compensation,
          salon_name: item.salons?.name,
          deal_title: item.deals?.title,
          deal_description: item.deals?.description,
          booking_url: item.deals?.booking_url
        }));

        setCollaborations(transformedData);
      } catch (err) {
        console.error('Error fetching active collaborations:', err);
        setError('Det gick inte att hämta dina aktiva samarbeten. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (collaborations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Du har inga aktiva samarbeten</h3>
        <p className="text-gray-500">
          När dina ansökningar blir godkända kommer dina aktiva samarbeten att visas här.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collaborations.map((collaboration) => (
        <CollaborationCard key={collaboration.id} collaboration={collaboration} />
      ))}
    </div>
  );
};
