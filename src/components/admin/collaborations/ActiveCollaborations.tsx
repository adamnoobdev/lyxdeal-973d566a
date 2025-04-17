
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
import { ActiveCollaboration } from '@/types/collaboration';

export function ActiveCollaborations() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Använd React Query med förbättrade inställningar
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
        
        // Förenkla hämtningen - hämta samtliga aktiva samarbeten utan att begränsa till specifika fält
        const { data, error } = await supabase
          .from('active_collaborations')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Supabase error:', error);
          toast.error('Kunde inte hämta samarbetsdata från databasen');
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} active collaborations:`, data);
        
        if (!data || data.length === 0) {
          console.log('No collaborations found in the database');
          // Försök att skapa en testkolumnen för felsökning
          await createTestEntry();
        }
        
        return data || [];
      } catch (err) {
        console.error('Error fetching active collaborations:', err);
        throw err;
      }
    },
    staleTime: 10000, // Cache data for only 10 seconds to make testing easier
    retry: 3,
  });
  
  // Lägg till testfunktion för att skapa en demopost om samarbeten saknas
  const createTestEntry = async () => {
    try {
      console.log("Attempting to create a test collaboration entry");
      
      // Kontrollera om vi har några salongs-ID:n att använda
      const { data: salons } = await supabase
        .from('salons')
        .select('id')
        .limit(1);
      
      // Kontrollera om vi har några erbjudande-ID:n att använda
      const { data: deals } = await supabase
        .from('deals')
        .select('id')
        .limit(1);
        
      if (!salons?.length || !deals?.length) {
        console.log("Cannot create test entry: no salons or deals found");
        return;
      }
      
      // Skapa en testpost för felsökningsändamål
      const { data, error } = await supabase
        .from('active_collaborations')
        .insert({
          salon_id: salons[0].id,
          deal_id: deals[0].id,
          discount_code: 'TEST123',
          views: 50,
          redemptions: 10,
          creator_id: '00000000-0000-0000-0000-000000000000', // placeholder UUID
          collaboration_id: '00000000-0000-0000-0000-000000000000' // placeholder UUID
        })
        .select();
        
      if (error) {
        console.error("Error creating test entry:", error);
      } else {
        console.log("Created test collaboration entry:", data);
        toast.success("Skapade testkollaboration för felsökning");
      }
    } catch (err) {
      console.error("Error in createTestEntry:", err);
    }
  };

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
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Uppdatera
              </Button>
              
              <Button
                variant="outline" 
                size="sm"
                onClick={createTestEntry}
                className="flex items-center gap-2 text-blue-600"
              >
                <DatabaseIcon className="h-4 w-4" />
                Skapa testdata
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
                className="flex items-center gap-2 text-blue-600"
              >
                <DatabaseIcon className="h-4 w-4" />
                Testa databas
              </Button>
            </div>
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
