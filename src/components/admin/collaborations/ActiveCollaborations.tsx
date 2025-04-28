
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { CollaborationTable } from "./CollaborationTable";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ActiveCollaborations = () => {
  const [collaborations, setCollaborations] = useState<ActiveCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc' as 'asc' | 'desc'
  });

  const fetchCollaborations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching active collaborations');
      
      const { data, error } = await supabase
        .from('active_collaborations')
        .select(`
          *,
          salons(name),
          deals(title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active collaborations:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} active collaborations`, data);
      
      const formattedCollaborations = data.map(collab => ({
        ...collab,
        salon_name: collab.salons?.name || 'Unknown',
        deal_title: collab.deals?.title || 'Unknown',
      })) as ActiveCollaboration[];

      setCollaborations(formattedCollaborations);
    } catch (error) {
      console.error('Error fetching active collaborations:', error);
      setError(error instanceof Error ? error : new Error('Ett fel uppstod vid hämtning av aktiva samarbeten'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Uppdaterar...
          </Button>
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCollaborations}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Försök igen
          </Button>
        </div>
        
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Ett fel uppstod</h3>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Aktiva samarbeten</h2>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök rabattkod"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCollaborations}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </div>
      </div>

      <CollaborationTable 
        collaborations={collaborations}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {collaborations.length === 0 && !searchTerm && (
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">Inga aktiva samarbeten</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground pb-6">
            Det finns inga aktiva samarbeten just nu.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
