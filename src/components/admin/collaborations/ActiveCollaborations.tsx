
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
      
      // Enkel initial sökning som inte kräver komplexa joins
      const { data: activeCollaborationsData, error: fetchError } = await supabase
        .from('active_collaborations')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Fel vid hämtning av aktiva samarbeten:', fetchError);
        throw fetchError;
      }
      
      if (!activeCollaborationsData || !Array.isArray(activeCollaborationsData)) {
        console.warn('Inga samarbeten hittades eller felaktigt dataformat', activeCollaborationsData);
        setCollaborations([]);
        return;
      }
      
      console.log(`Hittade ${activeCollaborationsData.length} aktiva samarbeten:`, activeCollaborationsData);
      
      // Förbered en array för de berikade samarbetsobjekten
      const enrichedCollaborations: ActiveCollaboration[] = [];
      
      // Gå igenom varje aktivt samarbete och hämta ytterligare information
      for (const collab of activeCollaborationsData) {
        try {
          console.log(`Bearbetar samarbete med ID: ${collab.id}`);
          
          // Hämta salonginformation
          const { data: salonData, error: salonError } = await supabase
            .from('salons')
            .select('name')
            .eq('id', collab.salon_id)
            .single();
          
          if (salonError) {
            console.warn(`Kunde inte hämta salongdata för salon_id ${collab.salon_id}:`, salonError);
          }
          
          // Hämta dealinformation
          const { data: dealData, error: dealError } = await supabase
            .from('deals')
            .select('title, description, booking_url')
            .eq('id', collab.deal_id)
            .single();
          
          if (dealError) {
            console.warn(`Kunde inte hämta deal-data för deal_id ${collab.deal_id}:`, dealError);
          }
          
          // Hämta samarbetsinformation
          const { data: collaborationData, error: collaborationError } = await supabase
            .from('collaboration_requests')
            .select('title, description, compensation')
            .eq('id', collab.collaboration_id)
            .single();
          
          if (collaborationError) {
            console.warn(`Kunde inte hämta samarbetsdata för collaboration_id ${collab.collaboration_id}:`, collaborationError);
          }
          
          // Lägg till det berikade objektet i arrayen
          enrichedCollaborations.push({
            ...collab,
            salon_name: salonData?.name || 'Okänd salong',
            salon_website: '', // Denna kolumn existerar inte i databasen
            deal_title: dealData?.title || 'Okänd behandling',
            deal_description: dealData?.description || '',
            booking_url: dealData?.booking_url || '',
            collaboration_title: collaborationData?.title || 'Okänt samarbete',
            collaboration_description: collaborationData?.description || '',
            compensation: collaborationData?.compensation || '',
          });
          
          console.log('Lade till berikat samarbete:', enrichedCollaborations[enrichedCollaborations.length - 1]);
        } catch (itemError) {
          console.error('Error enriching collaboration item:', itemError);
          // Vi fortsätter med nästa objekt istället för att avbryta hela processen
        }
      }
      
      console.log('Alla berikade samarbeten:', enrichedCollaborations);
      setCollaborations(enrichedCollaborations);
      
    } catch (error) {
      console.error('Error in fetchActiveCollaborations:', error);
      setError(error instanceof Error ? error : new Error('Ett fel uppstod vid hämtning av aktiva samarbeten'));
      toast.error('Kunde inte hämta aktiva samarbeten');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log('ActiveCollaborations component mounted, fetching data...');
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
  
  console.log('ActiveCollaborations render state:', { 
    isLoading, 
    error: error?.message, 
    collaborationsCount: collaborations.length 
  });
  
  // Visa laddningsstatus
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
  
  // Visa felstatus
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
  
  // Visa huvudkomponenten
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
        <div className="flex flex-wrap gap-2">
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
      
      {/* Visa varning om inga samarbeten finns */}
      {collaborations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Inga aktiva samarbeten hittades</p>
            <Button onClick={() => setIsCreating(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Skapa ditt första samarbete
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ActiveCollaborationsList collaborations={collaborations} />
      )}
      
      <CreateCollaborationDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};
