
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
        
        // Anropa en edge-funktion som returnerar Mapbox-token
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Fel vid hämtning av Mapbox-token:', error);
          setError('Kunde inte ladda karttjänsten');
          setIsLoading(false);
          return;
        }
        
        // Sätt token om den returnerades
        if (data && data.token) {
          setMapboxToken(data.token);
        } else {
          setError('Mapbox API-nyckel saknas');
        }
      } catch (error) {
        console.error('Fel vid hämtning av Mapbox-token:', error);
        setError('Kunde inte ladda karttjänsten');
      } finally {
        setIsLoading(false);
      }
    };

    getMapboxToken();
  }, []);

  return { mapboxToken, isLoading, error };
};
