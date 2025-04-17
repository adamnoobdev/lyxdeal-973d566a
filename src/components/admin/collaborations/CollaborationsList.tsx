
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Users } from 'lucide-react';
import { CollaborationRequest } from '@/types/collaboration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateCollaborationDialog } from './CreateCollaborationDialog';
import { CollaborationsTable } from './CollaborationsTable';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';
import { EditCollaborationDialog } from './EditCollaborationDialog';
import { DeleteCollaborationDialog } from './DeleteCollaborationDialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const CollaborationsList = () => {
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRequest, setEditingRequest] = useState<CollaborationRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<CollaborationRequest | null>(null);

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
  
  const handleRefresh = () => {
    fetchCollaborationRequests();
    toast.success('Data uppdaterad');
  };
  
  if (isLoading) {
    return <CollaborationsLoadingSkeleton />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ett fel uppstod</AlertTitle>
        <AlertDescription className="mb-2">
          Det gick inte att hämta samarbetsförfrågningar. {error.message}
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="mt-2 bg-background/80"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Försök igen
        </Button>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Samarbetsförfrågningar</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Uppdatera
          </Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Skapa förfrågan
          </Button>
        </div>
      </div>

      {collaborationRequests.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-1">Inga samarbetsförfrågningar</h3>
            <p className="text-muted-foreground mb-4">
              Skapa en ny samarbetsförfrågan för att börja
            </p>
            <Button onClick={() => setIsCreating(true)} className="mx-auto flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Skapa förfrågan
            </Button>
          </CardContent>
        </Card>
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
