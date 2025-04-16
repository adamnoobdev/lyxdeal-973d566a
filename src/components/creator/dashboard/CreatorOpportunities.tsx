
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CollaborationRequest } from "@/types/collaboration";
import { OpportunityCard } from "@/components/creator/dashboard/OpportunityCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CreatorOpportunities = () => {
  const [opportunities, setOpportunities] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Fetch all active collaboration requests that still have space for creators
        const { data, error } = await supabase
          .from('collaboration_requests')
          .select(`
            id,
            title,
            description,
            compensation,
            max_creators,
            current_creators,
            status,
            expires_at,
            created_at,
            salon_id,
            deal_id,
            salons:salon_id(name),
            deals:deal_id(title)
          `)
          .eq('status', 'active')
          .lt('current_creators', 'max_creators')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the CollaborationRequest type
        const transformedData: CollaborationRequest[] = data.map(item => ({
          id: item.id,
          salon_id: item.salon_id,
          deal_id: item.deal_id,
          title: item.title,
          description: item.description,
          compensation: item.compensation,
          status: item.status as "active" | "completed" | "cancelled",
          created_at: item.created_at,
          updated_at: item.created_at, // Using created_at as updated_at since we don't have it
          expires_at: item.expires_at,
          max_creators: item.max_creators,
          current_creators: item.current_creators,
          salon_name: item.salons?.name,
          deal_title: item.deals?.title
        }));

        setOpportunities(transformedData);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Det gick inte att hämta samarbetsmöjligheter. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
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

  if (opportunities.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Inga samarbetsmöjligheter just nu</h3>
        <p className="text-gray-500">
          Kom tillbaka senare för nya möjligheter att samarbeta med salonger.
        </p>
      </div>
    );
  }

  const handleApply = async (collaboration: CollaborationRequest, message: string) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData || !authData.user || !authData.user.id) {
        toast.error("Du måste vara inloggad för att ansöka");
        return;
      }

      const { data, error } = await supabase
        .from('collaboration_applications')
        .insert([
          {
            collaboration_id: collaboration.id,
            creator_id: authData.user.id,
            message: message,
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Error applying:', error);
        if (error.code === '23505') {
          toast.error("Du har redan ansökt om detta samarbete");
        } else {
          toast.error("Det gick inte att skicka ansökan");
        }
        return;
      }

      toast.success("Din ansökan har skickats!");
    } catch (err) {
      console.error('Error applying for collaboration:', err);
      toast.error("Ett fel uppstod. Försök igen senare.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onApply={handleApply}
        />
      ))}
    </div>
  );
};
