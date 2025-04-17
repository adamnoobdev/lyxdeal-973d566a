
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
      
      // Use an INNER JOIN approach instead of nested objects to ensure we get proper type safety
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
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active collaborations:', error);
        throw error;
      }
      
      console.log('Fetched active collaborations:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format returned from API');
      }
      
      // Now fetch additional salon and deal details separately for better type safety
      const formattedCollaborations = await Promise.all(data.map(async (collab) => {
        // Fetch salon details - Note that we're only selecting 'name' since 'website' doesn't exist
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('name')
          .eq('id', collab.salon_id)
          .single();
          
        if (salonError) {
          console.warn(`Could not fetch salon details for id ${collab.salon_id}:`, salonError);
        }
        
        // Fetch deal details
        const { data: dealData, error: dealError } = await supabase
          .from('deals')
          .select('title, description, booking_url')
          .eq('id', collab.deal_id)
          .single();
          
        if (dealError) {
          console.warn(`Could not fetch deal details for id ${collab.deal_id}:`, dealError);
        }
        
        // Fetch collaboration details
        const { data: collaborationData, error: collaborationError } = await supabase
          .from('collaboration_requests')
          .select('title, description, compensation')
          .eq('id', collab.collaboration_id)
          .single();
          
        if (collaborationError) {
          console.warn(`Could not fetch collaboration details for id ${collab.collaboration_id}:`, collaborationError);
        }
        
        // Return enriched collaboration object
        return {
          ...collab,
          salon_name: salonData?.name || 'Okänd salong',
          salon_website: '', // Website field doesn't exist, so we set it to empty string
          deal_title: dealData?.title || 'Okänd behandling',
          deal_description: dealData?.description || '',
          booking_url: dealData?.booking_url || '',
          collaboration_title: collaborationData?.title || 'Okänt samarbete',
          collaboration_description: collaborationData?.description || '',
          compensation: collaborationData?.compensation || '',
        } as ActiveCollaboration;
      }));
      
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
