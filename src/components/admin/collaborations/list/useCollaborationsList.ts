
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CollaborationRequest } from '@/types/collaboration';

export function useCollaborationsList() {
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollaborationRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching collaboration requests');
      
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          salons (name),
          deals (title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaboration requests:', error);
        setError(error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} collaboration requests`, data);
      
      const formattedRequests = data.map(request => ({
        ...request,
        salon_name: request.salons?.name || 'Unknown',
        deal_title: request.deals?.title || 'Unknown',
        status: request.status as 'active' | 'completed' | 'cancelled'
      })) as CollaborationRequest[];

      setCollaborationRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching collaboration requests:', error);
      setError(error instanceof Error ? error : new Error('Ett fel uppstod vid hämtning av samarbetsförfrågningar'));
      toast.error('Ett fel uppstod vid hämtning av samarbetsförfrågningar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborationRequests();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .insert(values)
        .select()
        .single();

      if (error) throw error;
      toast.success('Samarbetsförfrågan har skapats');
      fetchCollaborationRequests();
      return true;
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
      return false;
    }
  };

  const handleUpdate = async (values: any, id: string) => {
    try {
      const { error } = await supabase
        .from('collaboration_requests')
        .update(values)
        .eq('id', id);

      if (error) throw error;
      toast.success('Samarbetsförfrågan har uppdaterats');
      fetchCollaborationRequests();
      return true;
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collaboration_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Samarbetsförfrågan har tagits bort');
      fetchCollaborationRequests();
      return true;
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
      return false;
    }
  };

  return {
    collaborationRequests,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchCollaborationRequests
  };
}
