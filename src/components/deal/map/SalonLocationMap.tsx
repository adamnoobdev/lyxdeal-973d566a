
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
}

export const SalonLocationMap = ({ salonId, className = "" }: SalonLocationMapProps) => {
  const [showMap, setShowMap] = useState(false);
  const { mapboxToken } = useMapboxToken() || { mapboxToken: undefined };
  
  // Get address data
  const { address, salonName, salonPhone, isLoading: isAddressLoading, error: addressError } = useMapAddress(salonId);
  
  // Get coordinates
  const { coordinates, mapError, isLoading: isCoordinatesLoading } = useMapCoordinates(address);
  
  const isLoading = isAddressLoading || isCoordinatesLoading;
  const hasError = !!addressError || !!mapError;
  const error = addressError || mapError;
  
  // Show map when we have coordinates and no errors
  useEffect(() => {
    if (coordinates && !hasError && !isLoading) {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  }, [coordinates, hasError, isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return <MapLoadingState 
        address={address || ''} 
        salonName={salonName} 
        salonPhone={salonPhone}
      />;
    }
    
    if (hasError || !address) {
      return (
        <MapErrorState 
          errorMessage={error || "Adressen kunde inte hittas"} 
          address={address || ""}
          coordinates={coordinates}
          destination=""
          salonName={salonName}
          salonPhone={salonPhone}
          hideAddress={!address}
        />
      );
    }
    
    if (showMap && coordinates) {
      return (
        <div className="space-y-4">
          <MapViewer 
            coordinates={coordinates}
            mapboxToken={mapboxToken}
            address={address}
          />
          <div className="flex justify-end">
            <DirectionsButton address={address} variant="secondary" />
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <SalonInfoHeader 
        salonName={salonName} 
        address={address} 
        salonPhone={salonPhone} 
      />
      {renderContent()}
    </div>
  );
};
