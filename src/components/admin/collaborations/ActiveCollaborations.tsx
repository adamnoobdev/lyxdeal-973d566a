
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
        
        // Förbättra datahämtningen genom att lägga till mer fält och säkerställa korrekt typning
        const { data, error } = await supabase
          .from('active_collaborations')
          .select(`
            *,
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
          console.error('Supabase error:', error);
          toast.error('Kunde inte hämta samarbetsdata från databasen');
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} active collaborations:`, data);
        
        // Om data är tom, skriv tydlig logg
        if (!data || data.length === 0) {
          console.log('No collaborations found in the database');
        }
        
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
  
  // Mer detaljerad debugging för att hjälpa identifiera tomma tillstånd
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
              Det finns för närvarande inga aktiva samarbeten i databasen. Detta kan bero på att:
              <ul className="list-disc pl-5 mt-2">
                <li>Inga samarbeten har skapats än</li>
                <li>Alla samarbeten är inaktiva eller avslutade</li>
                <li>Det kan finnas ett problem med databaseanslutningen</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Databas-diagnostik</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Försöker läsa från tabellen <code>active_collaborations</code> men hittade inga poster.
            </p>
            <p className="text-sm text-muted-foreground">
              Kontrollera att:
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground mt-1">
              <li>Tabellen <code>active_collaborations</code> är korrekt skapad och har data</li>
              <li>Åtkomsträttigheter är korrekt konfigurerade</li>
              <li>RLS-policyer (Row Level Security) inte filtrerar bort alla rader</li>
            </ul>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-4 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Uppdatera
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Database connection test');
                supabase
                  .from('active_collaborations')
                  .select('count')
                  .then(({ data, error }) => {
                    if (error) {
                      console.error('Database test error:', error);
                      toast.error('Databasfel: ' + error.message);
                    } else {
                      toast.success('Databasanslutning OK, antal rader: ' + (data?.[0]?.count || 0));
                      console.log('Database connection OK, row count:', data);
                    }
                  });
              }}
              className="mt-2 ml-2 flex items-center gap-2 text-blue-600"
            >
              <DatabaseIcon className="h-4 w-4" />
              Testa databas
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
