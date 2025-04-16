
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CollaborationRequest } from '@/types/collaboration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateCollaborationDialog } from './CreateCollaborationDialog';
import { CollaborationsTable } from './CollaborationsTable';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';
import { EditCollaborationDialog } from './EditCollaborationDialog';
import { DeleteCollaborationDialog } from './DeleteCollaborationDialog';

export const CollaborationsList = () => {
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRequest, setEditingRequest] = useState<CollaborationRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<CollaborationRequest | null>(null);

  const fetchCollaborationRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          salons (name),
          deals (title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedRequests = data.map(request => ({
        ...request,
        salon_name: request.salons?.name,
        deal_title: request.deals?.title
      })) as CollaborationRequest[];

      setCollaborationRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching collaboration requests:', error);
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
      setIsCreating(false);
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
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
      setEditingRequest(null);
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
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
      setDeletingRequest(null);
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Samarbetsförfrågningar</h2>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Skapa förfrågan
        </Button>
      </div>

      {isLoading ? (
        <CollaborationsLoadingSkeleton />
      ) : (
        <CollaborationsTable
          collaborationRequests={collaborationRequests}
          onEdit={setEditingRequest}
          onDelete={setDeletingRequest}
        />
      )}

      <CreateCollaborationDialog 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        onCreate={handleCreate} 
      />
      
      {editingRequest && (
        <EditCollaborationDialog 
          isOpen={!!editingRequest} 
          onClose={() => setEditingRequest(null)} 
          onUpdate={handleUpdate} 
          collaborationRequest={editingRequest} 
        />
      )}
      
      {deletingRequest && (
        <DeleteCollaborationDialog 
          isOpen={!!deletingRequest} 
          onClose={() => setDeletingRequest(null)} 
          onDelete={() => handleDelete(deletingRequest.id)} 
          collaborationRequest={deletingRequest} 
        />
      )}
    </div>
  );
};
