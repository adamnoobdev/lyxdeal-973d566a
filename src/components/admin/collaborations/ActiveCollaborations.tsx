
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

      const formattedCollaborations = data.map(collab => ({
        ...collab,
        creator_email: collab.creator?.email,
        salon_name: collab.salon?.name,
        deal_title: collab.deal?.title
      })) as ActiveCollaboration[];

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
