
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CollaborationApplication } from "@/types/collaboration";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationsTable } from "./ApplicationsTable";
import { CreateCollaborationDialog } from "./CreateCollaborationDialog";

export const CollaborationApplications = () => {
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching collaboration applications');
      
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select(`
          *,
          collaborations:collaboration_id (title, salon_id, deal_id)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching collaboration applications:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} collaboration applications`, data);
      
      // Process each application with additional data
      const enrichedApplications = await Promise.all((data || []).map(async (app) => {
        const collaborationId = app.collaboration_id;
        let salonName = 'Unknown';
        let dealTitle = 'Unknown';
        
        // Only fetch collaboration details if we have an ID
        if (collaborationId) {
          // Get collaboration details
          const { data: collaborationData } = await supabase
            .from('collaboration_requests')
            .select('salon_id, deal_id')
            .eq('id', collaborationId)
            .single();
            
          if (collaborationData) {
            // Get salon name if we have salon_id
            if (collaborationData.salon_id) {
              const { data: salonData } = await supabase
                .from('salons')
                .select('name')
                .eq('id', collaborationData.salon_id)
                .single();
                
              if (salonData) {
                salonName = salonData.name;
              }
            }
            
            // Get deal title if we have deal_id
            if (collaborationData.deal_id) {
              const { data: dealData } = await supabase
                .from('deals')
                .select('title')
                .eq('id', collaborationData.deal_id)
                .single();
                
              if (dealData) {
                dealTitle = dealData.title;
              }
            }
          }
        }
        
        // Return enriched application
        return {
          ...app,
          creator_email: 'Unknown', // We don't have this data yet
          collaboration_title: app.collaborations?.title || 'Unknown',
          salon_name: salonName,
          deal_title: dealTitle
        };
      }));
      
      setApplications(enrichedApplications as CollaborationApplication[]);
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      setError(error instanceof Error ? error : new Error('Ett fel uppstod vid hämtning av ansökningar'));
      toast.error('Kunde inte hämta ansökningar');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  const handleRefresh = () => {
    fetchApplications();
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
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  const handleApprove = async (id: string, collaborationId: string, creatorId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('collaboration_applications')
        .update({ status: 'approved' })
        .eq('id', id);

      if (updateError) throw updateError;

      const { data: collaborationData, error: collabError } = await supabase
        .from('collaboration_requests')
        .select('salon_id, deal_id')
        .eq('id', collaborationId)
        .single();

      if (collabError || !collaborationData) throw collabError || new Error('Kunde inte hitta samarbetsinformation');

      const discountCode = `${creatorId.slice(0, 5).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;

      const { error: activeError } = await supabase
        .from('active_collaborations')
        .insert({
          collaboration_id: collaborationId,
          creator_id: creatorId,
          salon_id: collaborationData.salon_id,
          deal_id: collaborationData.deal_id,
          discount_code: discountCode,
          views: 0,
          redemptions: 0
        });

      if (activeError) throw activeError;

      toast.success('Ansökan godkänd och samarbete aktiverat');
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collaboration_applications')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Ansökan avvisad');
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Ansökningar</h2>
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
          <h2 className="text-xl font-semibold">Ansökningar</h2>
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
  
  if (applications.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Ansökningar</h2>
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
        
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-1">Inga ansökningar än</h3>
            <p className="text-muted-foreground mb-4">
              Det finns inga ansökningar för tillfället
            </p>
            <Button onClick={() => setIsCreating(true)} className="mx-auto flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Skapa samarbete
            </Button>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Ansökningar</h2>
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
      
      <ApplicationsTable 
        applications={applications} 
        onApprove={handleApprove}
        onReject={handleReject}
      />
      
      <CreateCollaborationDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};
