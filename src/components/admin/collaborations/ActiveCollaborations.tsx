
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActiveCollaborationsList } from './ActiveCollaborationsList';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";

export function ActiveCollaborations() {
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: collaborations = [], error, isLoading: isQueryLoading } = useQuery({
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
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} active collaborations`);
        return data || [];
      } catch (err) {
        console.error('Error fetching active collaborations:', err);
        throw err;
      }
    }
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
  
  if (isLoading) {
    return <CollaborationsLoadingSkeleton />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fel</AlertTitle>
        <AlertDescription>
          Det gick inte att hämta aktiva samarbeten. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (collaborations.length === 0) {
    return (
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Inga aktiva samarbeten</AlertTitle>
        <AlertDescription className="text-blue-600">
          Det finns för närvarande inga aktiva samarbeten mellan kreatörer och salonger.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <ActiveCollaborationsList collaborations={collaborations} />;
}
