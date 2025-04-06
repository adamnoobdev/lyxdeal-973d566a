
import { useState, useEffect } from "react";
import { MapViewer } from "./MapViewer";
import { DirectionsButton } from "./DirectionsButton";
import { MapLoadingState } from "./MapLoadingState";
import { MapErrorState } from "./MapErrorState";
import { SalonInfoHeader } from "./SalonInfoHeader";
import { useMapAddress } from "./useMapAddress";
import { useMapCoordinates } from "./useMapCoordinates";
import { useMapboxToken } from "@/hooks/useMapboxToken";

interface SalonLocationMapProps {
  salonId?: number | string | null;
  className?: string;
  city?: string;
  hidePhone?: boolean;
}

export const SalonLocationMap = ({ salonId, className = "", city, hidePhone = false }: SalonLocationMapProps) => {
  const [showMap, setShowMap] = useState(false);
  const { mapboxToken } = useMapboxToken() || { mapboxToken: undefined };
  
  console.log("[SalonLocationMap] Rendering with salonId:", salonId, "city:", city);
  
  // Get address data
  const { address, salonName, salonPhone, isLoading: isAddressLoading, error: addressError } = useMapAddress(salonId);
  
  // Get coordinates - använd staden som fallback om adressen saknas
  const displayAddress = address || (city ? `${city} centrum` : null);
  const { coordinates, mapError, isLoading: isCoordinatesLoading } = useMapCoordinates(displayAddress, city);
  
  const isLoading = isAddressLoading || isCoordinatesLoading;
  const hasError = !!addressError || !!mapError;
  const error = addressError || mapError || ((!address && !city) ? "Adress saknas" : null);
  
  // Skapa ett effektivt salongsnamn, även om salongsdata saknas
  const effectiveSalonName = salonName || (city ? `Salong i ${city}` : 'Okänd salong');
  
  // Show map when we have coordinates and no errors
  useEffect(() => {
    console.log("[SalonLocationMap] Effect triggered:", { 
      coordinates, hasError, isLoading, displayAddress 
    });
    
    if (coordinates && !hasError && !isLoading) {
      console.log("[SalonLocationMap] Showing map");
      setShowMap(true);
    } else {
      console.log("[SalonLocationMap] Hiding map due to:", {
        hasCoordinates: !!coordinates,
        hasError,
        isLoading,
        displayAddress
      });
      setShowMap(false);
    }
  }, [coordinates, hasError, isLoading, displayAddress]);

  const renderContent = () => {
    console.log("[SalonLocationMap] Rendering content state:", { 
      isLoading, hasError, displayAddress, showMap, coordinates 
    });
    
    if (isLoading) {
      return <MapLoadingState 
        address={displayAddress || ''} 
        salonName={effectiveSalonName} 
        salonPhone={salonPhone}
        hideAddress={!displayAddress}
        hidePhone={hidePhone}
      />;
    }
    
    if (hasError || !displayAddress) {
      return (
        <MapErrorState 
          errorMessage={error || "Adressinformation saknas"} 
          address={displayAddress || ""}
          coordinates={coordinates}
          destination={displayAddress || ""}
          salonName={effectiveSalonName}
          salonPhone={salonPhone}
          hideAddress={!displayAddress}
          hidePhone={hidePhone}
          city={city}
        />
      );
    }
    
    if (showMap && coordinates) {
      return (
        <div className="space-y-4">
          <MapViewer 
            coordinates={coordinates}
            mapboxToken={mapboxToken}
            address={displayAddress}
          />
          <div className="flex justify-end">
            <DirectionsButton 
              address={displayAddress} 
              coordinates={coordinates}
              variant="secondary" 
            />
          </div>
        </div>
      );
    }
    
    // Om vi hamnar här, visar vi ett reservalternativ
    return (
      <MapErrorState 
        errorMessage="Kunde inte visa karta" 
        address={displayAddress || ""}
        salonName={effectiveSalonName}
        salonPhone={salonPhone}
        hideAddress={!displayAddress}
        hidePhone={hidePhone}
        city={city}
      />
    );
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <SalonInfoHeader 
        salonName={effectiveSalonName} 
        address={displayAddress} 
        salonPhone={salonPhone} 
        hideAddress={!displayAddress}
        hidePhone={hidePhone}
      />
      {renderContent()}
    </div>
  );
};
