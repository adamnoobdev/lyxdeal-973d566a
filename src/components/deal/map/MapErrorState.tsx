
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorAlert } from "./error/ErrorAlert";
import { DirectionsButton } from "./DirectionsButton";
import { AddressTipsList } from "./error/AddressTipsList";
import { SalonAddressInfo } from "./error/SalonAddressInfo";

interface MapErrorStateProps {
  errorMessage: string;
  address?: string;
  coordinates?: [number, number];
  salonName?: string;
  salonPhone?: string | null;
  hideAddress?: boolean;
  hidePhone?: boolean;
  destination?: string;
  city?: string;
}

export const MapErrorState = ({
  errorMessage,
  address,
  coordinates,
  salonName,
  salonPhone,
  hideAddress = false,
  hidePhone = false,
  destination,
  city
}: MapErrorStateProps) => {
  const hasCoordinates = coordinates && coordinates.length === 2;
  
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <ErrorAlert errorMessage={errorMessage} />
      
      <div className="mt-4 space-y-4">
        <SalonAddressInfo 
          salonName={salonName} 
          address={address} 
          salonPhone={salonPhone}
          hideAddress={hideAddress} 
          hidePhone={hidePhone}
        />
        
        {hasCoordinates && destination && (
          <div className="mt-2">
            <DirectionsButton 
              address={destination} 
              coordinates={coordinates} 
              variant="outline"
            />
          </div>
        )}
        
        <AddressTipsList city={city} />
      </div>
    </div>
  );
};
