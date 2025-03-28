
import { useState, useEffect } from 'react';
import { MapViewer } from './map/MapViewer';
import { DirectionsButton } from './map/DirectionsButton';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { getCoordinates } from '@/utils/mapbox';
import { MapPin } from 'lucide-react';

interface SalonLocationMapProps {
  address: string;
  salonName: string;
  hideAddress?: boolean;
}

export const SalonLocationMap = ({ address, salonName, hideAddress = false }: SalonLocationMapProps) => {
  const { mapboxToken, isLoading: isTokenLoading, error: tokenError } = useMapboxToken();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!mapboxToken || !address) return;
      
      try {
        setIsLoading(true);
        const coords = await getCoordinates(address, mapboxToken);
        
        if (coords) {
          setCoordinates(coords);
          setMapError(null);
          console.log("Retrieved coordinates:", coords);
        } else {
          setMapError('Kunde inte ladda kartan för denna adress');
          console.error("No coordinates returned for address:", address);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setMapError('Kunde inte ladda kartan för denna adress');
      } finally {
        setIsLoading(false);
      }
    };

    if (mapboxToken && address) {
      console.log("Fetching coordinates for address:", address);
      fetchCoordinates();
    }
  }, [address, mapboxToken]);

  // Combine loading states
  if (isTokenLoading || (isLoading && !mapError)) {
    return <MapLoadingState address={address} hideAddress={hideAddress} />;
  }

  // Handle error states
  if (tokenError || mapError) {
    return (
      <MapErrorState 
        address={address}
        errorMessage={tokenError || mapError || 'Kunde inte ladda kartan'}
        coordinates={coordinates}
        destination={`${salonName} ${address}`}
        hideAddress={hideAddress}
      />
    );
  }

  // Only render the map if we have coordinates
  if (!coordinates) {
    return (
      <MapErrorState 
        address={address}
        errorMessage="Kunde inte hitta koordinater för adressen"
        coordinates={null}
        destination={`${salonName} ${address}`}
        hideAddress={hideAddress}
      />
    );
  }

  return (
    <div className="space-y-4">
      {!hideAddress && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pl-2">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
      )}
      
      <MapViewer 
        mapboxToken={mapboxToken} 
        coordinates={coordinates} 
      />
      
      <DirectionsButton 
        coordinates={coordinates} 
        destination={`${salonName} ${address}`} 
      />
    </div>
  );
};
