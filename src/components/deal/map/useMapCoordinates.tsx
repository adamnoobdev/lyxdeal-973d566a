
import { useState, useEffect } from 'react';
import { getCoordinates } from '@/utils/mapbox';
import { useMapboxToken } from '@/hooks/useMapboxToken';

interface UseMapCoordinatesProps {
  formattedAddress: string | null;
  city?: string;
}

export const useMapCoordinates = (formattedAddress: string | null, city?: string) => {
  const { mapboxToken } = useMapboxToken() || { mapboxToken: undefined };
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!mapboxToken || !formattedAddress) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching coordinates for address:", formattedAddress);
        console.log("Using mapboxToken type:", typeof mapboxToken);
        console.log("Token available:", !!mapboxToken);
        
        const coords = await getCoordinates(formattedAddress, mapboxToken);
        
        if (coords) {
          setCoordinates(coords);
          setMapError(null);
          console.log("Retrieved coordinates:", coords);
        } else {
          setMapError('Kunde inte hitta denna adress på kartan. Försöker igen...');
          console.error("No coordinates returned for address:", formattedAddress);
          
          // Try an alternative format if first attempt fails
          if (city && retryCount < 1) {
            setRetryCount(prev => prev + 1);
            const cityOnlyCoords = await getCoordinates(city, mapboxToken);
            
            if (cityOnlyCoords) {
              setCoordinates(cityOnlyCoords);
              setMapError(null);
              console.log("Retrieved city coordinates as fallback:", cityOnlyCoords);
            } else {
              setMapError('Kunde inte hitta denna adress på kartan. Kontrollera att adressen är korrekt och fullständig.');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setMapError('Ett problem uppstod när vi försökte visa kartan för denna adress.');
      } finally {
        setIsLoading(false);
      }
    };

    if (mapboxToken && formattedAddress) {
      fetchCoordinates();
    } else {
      setIsLoading(false);
      if (!mapboxToken) {
        setMapError('Mapbox-token saknas');
      } else if (!formattedAddress) {
        setMapError('Adress saknas');
      }
    }
  }, [formattedAddress, mapboxToken, city, retryCount]);

  return {
    coordinates,
    mapError,
    isLoading,
    setMapError
  };
};
