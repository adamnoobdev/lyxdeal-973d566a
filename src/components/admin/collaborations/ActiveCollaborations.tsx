
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaborationsList } from "./ActiveCollaborationsList";
import { ActiveCollaboration } from "@/types/collaboration";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { CreateCollaborationDialog } from "./CreateCollaborationDialog";

export const ActiveCollaborations = () => {
  const [collaborations, setCollaborations] = useState<ActiveCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const fetchActiveCollaborations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching active collaborations...');
      
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
          collaborations:collaboration_id (title, description, compensation),
          salon_details:salon_id (name, website),
          deal_details:deal_id (title, description, booking_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active collaborations:', error);
        throw error;
      }
      
      console.log('Fetched active collaborations:', data);
      
      // Transform data to match ActiveCollaboration type
      const formattedCollaborations = data.map(collab => ({
        ...collab,
        collaboration_title: collab.collaborations?.title || 'Okänd titel',
        collaboration_description: collab.collaborations?.description || '',
        compensation: collab.collaborations?.compensation || '',
        salon_name: collab.salon_details?.name || 'Okänd salong',
        salon_website: collab.salon_details?.website || '',
        deal_title: collab.deal_details?.title || 'Okänd behandling',
        deal_description: collab.deal_details?.description || '',
        booking_url: collab.deal_details?.booking_url || '',
      })) as ActiveCollaboration[];
      
      setCollaborations(formattedCollaborations);
      console.log('Processed collaborations:', formattedCollaborations);
    } catch (error) {
      console.error('Error in fetchActiveCollaborations:', error);
      setError(error instanceof Error ? error : new Error('Ett fel uppstod vid hämtning av aktiva samarbeten'));
      toast.error('Kunde inte hämta aktiva samarbeten');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActiveCollaborations();
  }, []);
  
  const handleRefresh = () => {
    fetchActiveCollaborations();
    toast.success('Data uppdaterad');
  };
  
  const handleCreate = async (values: any) => {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .insert(values)
        .select()
        .single();

      if (error) throw error;
      toast.success('Samarbetsförfrågan har skapats');
      setIsCreating(false);
      fetchActiveCollaborations();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Uppdaterar...
            </Button>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Skapa samarbete
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Försök igen
            </Button>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Skapa samarbete
            </Button>
          </div>
        </div>
        
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Ett fel uppstod</h3>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
        
        <CreateCollaborationDialog
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          onCreate={handleCreate}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
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
            Skapa samarbete
          </Button>
        </div>
      </div>
      
      <ActiveCollaborationsList collaborations={collaborations} />
      
      <CreateCollaborationDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};
