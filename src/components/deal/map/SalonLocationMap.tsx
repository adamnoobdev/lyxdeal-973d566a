
import { useState, useEffect } from "react";
import { MapViewer } from "./MapViewer";
import { DirectionsButton } from "./DirectionsButton";
import { MapLoadingState } from "./MapLoadingState";
import { MapErrorState } from "./MapErrorState";
import { SalonInfoHeader } from "./SalonInfoHeader";
import { useMapAddress } from "./useMapAddress";
import { useMapCoordinates } from "./useMapCoordinates";

interface SalonLocationMapProps {
  salonId?: number | string | null;
  className?: string;
}

export const SalonLocationMap = ({ salonId, className = "" }: SalonLocationMapProps) => {
  const [showMap, setShowMap] = useState(false);
  
  // Get address data
  const { address, salonName, salonPhone, isLoading: isAddressLoading, error: addressError } = useMapAddress(salonId);
  
  // Get coordinates
  const { coordinates, isLoading: isCoordinatesLoading, error: coordinatesError } = useMapCoordinates(address);
  
  const isLoading = isAddressLoading || isCoordinatesLoading;
  const hasError = !!addressError || !!coordinatesError;
  const error = addressError || coordinatesError;
  
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
      return <MapLoadingState />;
    }
    
    if (hasError || !address) {
      return (
        <MapErrorState 
          errorMessage={error || "Adressen kunde inte hittas"} 
          salonName={salonName} 
          salonPhone={salonPhone}
          address={address || ""}
          hideAddress={!address}
        />
      );
    }
    
    if (showMap && coordinates) {
      return (
        <div className="space-y-4">
          <MapViewer 
            longitude={coordinates.longitude} 
            latitude={coordinates.latitude} 
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
        phone={salonPhone} 
      />
      {renderContent()}
    </div>
  );
};
