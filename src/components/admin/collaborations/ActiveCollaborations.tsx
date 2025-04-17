
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActiveCollaborationsList } from './ActiveCollaborationsList';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertCircle, RefreshCw, DatabaseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveCollaborations() {
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    data: collaborations = [], 
    error, 
    isLoading: isQueryLoading,
    refetch 
  } = useQuery({
    queryKey: ['active-collaborations'],
    queryFn: async () => {
      try {
        console.log('Fetching active collaborations');
        
        const { data, error } = await supabase
          .from('active_collaborations')
          .select(`
            *,
            collaboration_id,
            creator_id
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Supabase error:', error);
          toast.error('Kunde inte hämta samarbetsdata från databasen');
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} active collaborations`, data);
        return data || [];
      } catch (err) {
        console.error('Error fetching active collaborations:', err);
        throw err;
      }
    },
    staleTime: 30000, // Cache data for 30 seconds to reduce unnecessary requests
    retry: 3, // Increase retry attempts for better reliability
  });
  
  // Using useEffect for better control over loading state
  useEffect(() => {
    if (!isQueryLoading) {
      // Add slight delay to prevent flickering for fast loads
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isQueryLoading]);

  const handleRefresh = () => {
    setIsLoading(true);
    refetch().then(() => {
      toast.success('Data har uppdaterats');
    }).catch((error) => {
      toast.error('Kunde inte uppdatera data');
      console.error('Refresh error:', error);
    });
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
          Det gick inte att hämta aktiva samarbeten. {error instanceof Error ? error.message : 'Försök igen senare.'}
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
  
  // Debugging alert to help identify empty states
  if (collaborations.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="h-5 w-5 mr-2 text-blue-500" />
            Diagnostik: Inga aktiva samarbeten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Inga aktiva samarbeten</AlertTitle>
            <AlertDescription className="text-blue-600">
              Det finns för närvarande inga aktiva samarbeten mellan kreatörer och salonger.
            </AlertDescription>
          </Alert>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Felsökningshjälp</h3>
            <p className="text-sm text-muted-foreground mb-2">
              För att samarbeten ska visas här behöver du först:
            </p>
            <ol className="text-sm list-decimal pl-5 space-y-1 text-muted-foreground">
              <li>Skapa en samarbetsförfrågan på "Förfrågningar"-fliken</li>
              <li>Få en kreatör att ansöka via fliken "Ansökningar"</li>
              <li>Godkänna ansökningen för att skapa ett aktivt samarbete</li>
            </ol>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-4 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Uppdatera
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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
      <ActiveCollaborationsList collaborations={collaborations} />
    </div>
  );
}
