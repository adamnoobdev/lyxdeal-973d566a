
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CollaborationApplication } from '@/types/collaboration';
import { ApplicationsTable } from './ApplicationsTable';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const CollaborationApplications = () => {
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching collaboration applications');
      
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select(`
          *,
          creator:creator_id(email),
          collaboration:collaboration_id(
            title, 
            salon_id(name),
            deal_id(title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        setError(error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} collaboration applications`, data);
      
      // Safely map data with fallback values for potentially missing properties
      const formattedApplications = data.map(app => {
        // Check if creator is an object with email property
        const creatorEmail = typeof app.creator === 'object' && app.creator !== null 
          ? (app.creator as any).email || 'Unknown' 
          : 'Unknown';
        
        // Check if collaboration exists and has properties
        const collaboration = app.collaboration || {};
        
        // Extract values with fallbacks, using type assertions to handle potentially undefined properties
        const collaborationTitle = typeof collaboration === 'object' && 'title' in collaboration 
          ? (collaboration as any).title || 'Unknown' 
          : 'Unknown';
        
        const salonId = typeof collaboration === 'object' && 'salon_id' in collaboration ? collaboration.salon_id : null;
        const salonName = typeof salonId === 'object' && salonId !== null && 'name' in salonId 
          ? (salonId as any).name || 'Unknown' 
          : 'Unknown';
        
        const dealId = typeof collaboration === 'object' && 'deal_id' in collaboration ? collaboration.deal_id : null;
        const dealTitle = typeof dealId === 'object' && dealId !== null && 'title' in dealId 
          ? (dealId as any).title || 'Unknown' 
          : 'Unknown';

        return {
          ...app,
          creator_email: creatorEmail,
          collaboration_title: collaborationTitle,
          salon_name: salonName,
          deal_title: dealTitle,
          status: app.status as 'pending' | 'approved' | 'rejected'
        };
      }) as CollaborationApplication[];

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error instanceof Error ? error : new Error('Ett fel uppstod vid hämtning av ansökningar'));
      toast.error('Ett fel uppstod vid hämtning av ansökningar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (applicationId: string, collaborationId: string, creatorId: string) => {
    try {
      // Step 1: Get salon_id and deal_id from collaboration request
      const { data: collaborationData, error: collaborationError } = await supabase
        .from('collaboration_requests')
        .select('salon_id, deal_id')
        .eq('id', collaborationId)
        .single();
        
      if (collaborationError) throw collaborationError;
      
      // Step 2: Generate discount code
      const { data: creatorData, error: creatorError } = await supabase
        .from('creator_applications') 
        .select('instagram_handle')
        .eq('email', (await supabase.auth.getUser(creatorId)).data.user?.email)
        .single();
        
      if (creatorError) {
        console.error("Error fetching creator data:", creatorError);
        // Fallback if we can't get Instagram handle
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const discountCode = `CREATOR${randomCode}`;
        
        // Create active collaboration
        const { data, error } = await supabase
          .from('active_collaborations')
          .insert({
            collaboration_id: collaborationId,
            creator_id: creatorId,
            salon_id: collaborationData.salon_id,
            deal_id: collaborationData.deal_id,
            discount_code: discountCode
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Update application status
        await supabase
          .from('collaboration_applications')
          .update({ status: 'approved' })
          .eq('id', applicationId);
          
        toast.success('Ansökan godkänd och samarbete skapat');
        fetchApplications();
        return;
      }
      
      // Generate code from Instagram handle if available
      const instagramHandle = creatorData.instagram_handle;
      const { data: discountCodeData } = await supabase.rpc(
        'generate_collaboration_discount_code', 
        { creator_handle: instagramHandle }
      );
      
      const discountCode = discountCodeData || `CREATOR${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      // Create active collaboration
      const { data, error } = await supabase
        .from('active_collaborations')
        .insert({
          collaboration_id: collaborationId,
          creator_id: creatorId,
          salon_id: collaborationData.salon_id,
          deal_id: collaborationData.deal_id,
          discount_code: discountCode
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update application status
      await supabase
        .from('collaboration_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
        
      toast.success('Ansökan godkänd och samarbete skapat');
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await supabase
        .from('collaboration_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);
        
      toast.success('Ansökan avvisad');
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };
  
  const handleRefresh = () => {
    fetchApplications();
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
          Det gick inte att hämta ansökningar. {error.message}
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

  if (applications.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="pt-6 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-lg mb-1">Inga ansökningar hittades</h3>
          <p className="text-muted-foreground mb-4">
            Det finns inga ansökningar från kreatörer för tillfället.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="mx-auto flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Uppdatera
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Kreatörsansökningar</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Uppdatera
        </Button>
      </div>

      <ApplicationsTable
        applications={applications}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
