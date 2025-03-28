import { useState, useEffect } from 'react';
import { MapViewer } from './map/MapViewer';
import { DirectionsButton } from './map/DirectionsButton';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { getCoordinates } from '@/utils/mapbox';
import { MapPin, Store } from 'lucide-react';

interface SalonLocationMapProps {
  address: string;
  salonName: string;
  city?: string;
  hideAddress?: boolean;
}

export const SalonLocationMap = ({ 
  address, 
  salonName, 
  city, 
  hideAddress = false 
}: SalonLocationMapProps) => {
  const { mapboxToken, isLoading: isTokenLoading, error: tokenError } = useMapboxToken();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Format address for geocoding
  const getFormattedAddress = () => {
    if (!address) return '';
    
    // If address already contains the city, use it as is
    if (address.toLowerCase().includes(city?.toLowerCase() || '')) {
      return address;
    }
    
    // Otherwise, append the city if available
    return city ? `${address}, ${city}` : address;
  };

  const formattedAddress = getFormattedAddress();

  // Check if we have a valid address before trying to fetch coordinates
  if (!formattedAddress || formattedAddress.trim() === '') {
    console.log("SalonLocationMap: Invalid or empty address provided", { address, city });
    return (
      <div className="p-4 border border-border rounded-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full bg-primary/5 p-2">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-medium text-foreground">
            {salonName}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Adressinformation saknas för denna salong.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!mapboxToken || !formattedAddress) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching coordinates for address:", formattedAddress);
        const coords = await getCoordinates(formattedAddress, mapboxToken);
        
        if (coords) {
          setCoordinates(coords);
          setMapError(null);
          console.log("Retrieved coordinates:", coords);
        } else {
          setMapError('Kunde inte ladda kartan för denna adress');
          console.error("No coordinates returned for address:", formattedAddress);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setMapError('Kunde inte ladda kartan för denna adress');
      } finally {
        setIsLoading(false);
      }
    };

    if (mapboxToken && formattedAddress) {
      fetchCoordinates();
    }
  }, [formattedAddress, mapboxToken]);

  // Combine loading states
  if (isTokenLoading || (isLoading && !mapError)) {
    return <MapLoadingState address={formattedAddress} hideAddress={hideAddress} />;
  }

  // Handle error states
  if (tokenError || mapError) {
    return (
      <MapErrorState 
        address={formattedAddress}
        errorMessage={tokenError || mapError || 'Kunde inte ladda kartan'}
        coordinates={coordinates}
        destination={`${salonName}, ${formattedAddress}`}
        hideAddress={hideAddress}
      />
    );
  }

  // Only render the map if we have coordinates
  if (!coordinates) {
    return (
      <MapErrorState 
        address={formattedAddress}
        errorMessage="Kunde inte hitta koordinater för adressen"
        coordinates={null}
        destination={`${salonName}, ${formattedAddress}`}
        hideAddress={hideAddress}
      />
    );
  }

  return (
    <div className="space-y-4">
      {!hideAddress && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pl-2">
          <MapPin className="h-4 w-4" />
          <span>{formattedAddress}</span>
        </div>
      )}
      
      <MapViewer 
        mapboxToken={mapboxToken} 
        coordinates={coordinates} 
      />
      
      <DirectionsButton 
        coordinates={coordinates} 
        destination={`${salonName}, ${formattedAddress}`} 
      />
    </div>
  );
};
