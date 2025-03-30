import { useMapboxToken } from '@/hooks/useMapboxToken';
import { MapViewer } from './MapViewer';
import { DirectionsButton } from './DirectionsButton';
import { MapLoadingState } from './MapLoadingState';
import { MapErrorState } from './MapErrorState';
import { SalonInfoHeader } from './SalonInfoHeader';
import { useMapAddress } from './useMapAddress';
import { useMapCoordinates } from './useMapCoordinates';
import { Store, Phone } from 'lucide-react';

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
  
  const { normalizedAddress, formattedAddress, isValidAddress } = useMapAddress({
    address,
    city
  });

  const { 
    coordinates, 
    mapError, 
    isLoading 
  } = useMapCoordinates({
    mapboxToken,
    formattedAddress: isValidAddress ? formattedAddress : null,
    city
  });

  console.log("SalonLocationMap rendering with props:", { 
    address, 
    salonName, 
    salonPhone, 
    city, 
    hideAddress,
    mapboxToken: !!mapboxToken,
    isTokenLoading,
    formattedAddress,
    isValidAddress
  });

  if (!isValidAddress) {
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

  if (isTokenLoading || (isLoading && !mapError)) {
    return <MapLoadingState 
             address={normalizedAddress} 
             hideAddress={hideAddress} 
             salonName={salonName}
             salonPhone={salonPhone}
           />;
  }

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
      <SalonInfoHeader 
        salonName={salonName}
        salonPhone={salonPhone}
        address={normalizedAddress}
        hideAddress={hideAddress}
      />
      
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
