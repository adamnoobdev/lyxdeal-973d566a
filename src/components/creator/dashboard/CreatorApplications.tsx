
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CollaborationApplication } from "@/types/collaboration";
import { ApplicationCard } from "@/components/creator/dashboard/ApplicationCard";
import { Loader2 } from "lucide-react";

export const CreatorApplications = () => {
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error('Ej inloggad');

        // Hämta användarens ansökningar
        const { data, error } = await supabase
          .from('collaboration_applications')
          .select(`
            id,
            collaboration_id,
            creator_id,
            status,
            message,
            created_at,
            updated_at,
            collaboration_requests:collaboration_id (
              title,
              salon_id,
              deal_id,
              salons:salon_id (name),
              deals:deal_id (title)
            )
          `)
          .eq('creator_id', authData.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transformera datan till rätt format
        const transformedData: CollaborationApplication[] = data.map(item => ({
          id: item.id,
          collaboration_id: item.collaboration_id,
          creator_id: item.creator_id,
          status: item.status as "pending" | "approved" | "rejected",
          message: item.message,
          created_at: item.created_at,
          updated_at: item.updated_at,
          collaboration_title: item.collaboration_requests?.title,
          salon_name: item.collaboration_requests?.salons?.name,
          deal_title: item.collaboration_requests?.deals?.title
        }));

        setApplications(transformedData);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Det gick inte att hämta dina ansökningar. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Du har inga ansökningar</h3>
        <p className="text-gray-500">
          Hitta möjligheter i fliken "Möjligheter" och ansök om samarbeten.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
};
