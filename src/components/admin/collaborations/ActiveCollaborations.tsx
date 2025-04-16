
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ActiveCollaboration } from '@/types/collaboration';
import { ActiveCollaborationsTable } from './ActiveCollaborationsTable';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';

export const ActiveCollaborations = () => {
  const [collaborations, setCollaborations] = useState<ActiveCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollaborations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('active_collaborations')
        .select(`
          *,
          creator:creator_id(email),
          salon:salon_id(name),
          deal:deal_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Safely map data with fallback values for potentially missing properties
      const formattedCollaborations = data.map(collab => {
        // Check if creator is an object with email property
        const creatorEmail = typeof collab.creator === 'object' && collab.creator !== null 
          ? (collab.creator as any).email || 'Unknown' 
          : 'Unknown';
        
        // Check if salon is an object with name property
        const salonName = typeof collab.salon === 'object' && collab.salon !== null 
          ? (collab.salon as any).name || 'Unknown' 
          : 'Unknown';
        
        // Check if deal is an object with title property
        const dealTitle = typeof collab.deal === 'object' && collab.deal !== null 
          ? (collab.deal as any).title || 'Unknown' 
          : 'Unknown';

        return {
          ...collab,
          creator_email: creatorEmail,
          salon_name: salonName,
          deal_title: dealTitle
        };
      }) as ActiveCollaboration[];

      setCollaborations(formattedCollaborations);
    } catch (error) {
      console.error('Error fetching active collaborations:', error);
      toast.error('Ett fel uppstod vid hämtning av aktiva samarbeten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('active_collaborations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Samarbete har tagits bort');
      fetchCollaborations();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
      </div>

      {isLoading ? (
        <CollaborationsLoadingSkeleton />
      ) : (
        <ActiveCollaborationsTable
          collaborations={collaborations}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
