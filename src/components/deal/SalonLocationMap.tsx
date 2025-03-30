
import { useState, useEffect } from 'react';
import { MapViewer } from './map/MapViewer';
import { DirectionsButton } from './map/DirectionsButton';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { getCoordinates, normalizeAddress } from '@/utils/mapbox';
import { MapPin, Store, Phone } from 'lucide-react';

interface SalonLocationMapProps {
  address: string;
  salonName: string;
  salonPhone?: string | null;
  city?: string;
  hideAddress?: boolean;
}

export const SalonLocationMap = ({ 
  address, 
  salonName, 
  salonPhone,
  city, 
  hideAddress = false 
}: SalonLocationMapProps) => {
  const { mapboxToken, isLoading: isTokenLoading, error: tokenError } = useMapboxToken();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [normalizedAddress, setNormalizedAddress] = useState<string>('');

  // Format address for geocoding
  const getFormattedAddress = () => {
    if (!address) return city || '';
    
    // Om adressen redan innehåller staden, använd den som den är
    if (city && address.toLowerCase().includes(city.toLowerCase())) {
      return address;
    }
    
    // Annars, lägg till staden om den finns tillgänglig
    return city ? `${address}, ${city}` : address;
  };

  const formattedAddress = getFormattedAddress();

  console.log("SalonLocationMap props:", { address, salonName, salonPhone, city });
  console.log("Formatted address for geocoding:", formattedAddress);

  useEffect(() => {
    // Normalisera adressen för bättre visning
    setNormalizedAddress(normalizeAddress(formattedAddress));
  }, [formattedAddress]);

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
        {salonPhone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Phone className="h-4 w-4" />
            <a href={`tel:${salonPhone}`} className="hover:underline">{salonPhone}</a>
          </div>
        )}
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
        console.log("Using mapboxToken type:", typeof mapboxToken);
        
        const coords = await getCoordinates(formattedAddress, mapboxToken);
        
        if (coords) {
          setCoordinates(coords);
          setMapError(null);
          console.log("Retrieved coordinates:", coords);
        } else {
          setMapError('Kunde inte hitta denna adress på kartan. Kontrollera att adressen är korrekt och fullständig.');
          console.error("No coordinates returned for address:", formattedAddress);
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
    }
  }, [formattedAddress, mapboxToken]);

  // Combine loading states
  if (isTokenLoading || (isLoading && !mapError)) {
    return <MapLoadingState 
              address={normalizedAddress} 
              hideAddress={hideAddress} 
              salonName={salonName}
              salonPhone={salonPhone}
            />;
  }

  // Handle error states
  if (tokenError || mapError) {
    const errorMessage = tokenError 
      ? (tokenError instanceof Error ? tokenError.message : String(tokenError))
      : mapError || 'Kunde inte ladda kartan';
      
    return (
      <MapErrorState 
        address={normalizedAddress}
        errorMessage={errorMessage}
        coordinates={coordinates}
        destination={`${salonName}, ${normalizedAddress}`}
        hideAddress={hideAddress}
        salonName={salonName}
        salonPhone={salonPhone}
      />
    );
  }

  // Only render the map if we have coordinates
  if (!coordinates) {
    return (
      <MapErrorState 
        address={normalizedAddress}
        errorMessage="Kunde inte hitta koordinater för adressen. Kontrollera att adressen inkluderar gatunummer, postnummer och stad."
        coordinates={null}
        destination={`${salonName}, ${normalizedAddress}`}
        hideAddress={hideAddress}
        salonName={salonName}
        salonPhone={salonPhone}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Salon info section with name, phone and address */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          <span className="font-medium">{salonName}</span>
        </div>
        
        {salonPhone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${salonPhone}`} className="hover:underline">{salonPhone}</a>
          </div>
        )}
        
        {!hideAddress && normalizedAddress && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{normalizedAddress}</span>
          </div>
        )}
      </div>
      
      <MapViewer 
        mapboxToken={mapboxToken || ''} 
        coordinates={coordinates} 
      />
      
      <DirectionsButton 
        coordinates={coordinates} 
        destination={`${salonName}, ${normalizedAddress}`} 
      />
    </div>
  );
};
