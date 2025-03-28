
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface MapboxTokenResponse {
  token: string;
}

export const useMapboxToken = () => {
  const [tokenFromStorage, setTokenFromStorage] = useState<string | null>(null);

  // Försök först hämta token från localStorage om det finns
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setTokenFromStorage(savedToken);
    }
  }, []);

  // Använd react-query för att hämta token från Supabase Edge Function
  const { data, isLoading, error } = useQuery({
    queryKey: ['mapbox-token'],
    queryFn: async () => {
      try {
        // Först kontrollera om vi redan har en token från localStorage
        if (tokenFromStorage) {
          console.log("Using Mapbox token from localStorage");
          return { token: tokenFromStorage };
        }

        // Annars hämta via Supabase function
        console.log("Fetching Mapbox token from Supabase function");
        const { data, error } = await supabase.functions.invoke<MapboxTokenResponse>('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          throw new Error(`Kunde inte hämta Mapbox token: ${error.message}`);
        }
        
        if (!data || !data.token) {
          console.error('No Mapbox token returned:', data);
          throw new Error('Ingen Mapbox token returnerades från servern');
        }
        
        // Spara token i localStorage för framtida användning
        localStorage.setItem('mapbox_token', data.token);
        
        return data;
      } catch (error) {
        console.error('Exception fetching Mapbox token:', error);
        throw error;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // Caching token for 24 hours
    retry: 3,
  });

  return {
    mapboxToken: data?.token || tokenFromStorage || '',
    isLoading: isLoading && !tokenFromStorage,
    error: error ? (error instanceof Error ? error.message : 'Okänt fel vid hämtning av Mapbox token') : null,
  };
};
