
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Call edge function to retrieve Mapbox token
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setError('Kunde inte ladda karttjänsten');
          setIsLoading(false);
          return;
        }
        
        // Set token if returned
        if (data && data.token) {
          console.log("Mapbox token retrieved successfully");
          setMapboxToken(data.token);
        } else {
          console.error('No token found in response');
          setError('Mapbox API-nyckel saknas');
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        setError('Kunde inte ladda karttjänsten');
      } finally {
        setIsLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  return { mapboxToken, isLoading, error };
};
