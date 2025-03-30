
import { useState, useEffect } from 'react';
import { getCoordinates } from '@/utils/mapbox';
import { useMapboxToken } from '@/hooks/useMapboxToken';

interface UseMapCoordinatesProps {
  formattedAddress: string;
  city?: string;
}

export const useMapCoordinates = (formattedAddress: string | null, city?: string | null) => {
  const { mapboxToken } = useMapboxToken() || { mapboxToken: undefined };
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!mapboxToken) {
        setMapError('Mapbox-token saknas');
        setIsLoading(false);
        return;
      }
      
      // Om det inte finns någon adress alls att prova
      if (!formattedAddress && !city) {
        setMapError('Adressinformation saknas');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        let addressToTry = formattedAddress;
        
        // Om vi inte har en adress men har en stad, använd staden + centrum
        if (!addressToTry && city) {
          addressToTry = `${city} centrum`;
          console.log("Ingen adress tillgänglig, använder stad istället:", addressToTry);
        }
        
        console.log("Hämtar koordinater för adress:", addressToTry);
        console.log("Använder mapboxToken typ:", typeof mapboxToken);
        console.log("Token tillgänglig:", !!mapboxToken);
        
        if (addressToTry) {
          const coords = await getCoordinates(addressToTry, mapboxToken);
          
          if (coords) {
            setCoordinates(coords);
            setMapError(null);
            console.log("Hämtade koordinater:", coords);
          } else {
            setMapError('Kunde inte hitta denna adress på kartan. Försöker igen...');
            console.error("Inga koordinater returnerades för adress:", addressToTry);
            
            // Pröva med bara staden om första försöket misslyckas
            if (city && retryCount < 1) {
              setRetryCount(prev => prev + 1);
              const cityOnlyCoords = await getCoordinates(city, mapboxToken);
              
              if (cityOnlyCoords) {
                setCoordinates(cityOnlyCoords);
                setMapError(null);
                console.log("Hämtade stadskoordinater som reserv:", cityOnlyCoords);
              } else {
                setMapError('Kunde inte hitta denna adress på kartan. Kontrollera att adressen är korrekt och fullständig.');
              }
            }
          }
        } else {
          setMapError('Adress saknas');
        }
      } catch (error) {
        console.error('Fel vid hämtning av koordinater:', error);
        setMapError('Ett problem uppstod när vi försökte visa kartan för denna adress.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [formattedAddress, mapboxToken, city, retryCount]);

  return {
    coordinates,
    mapError,
    isLoading,
    setMapError
  };
};
