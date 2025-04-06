import React from "react";
import { SalonAddressInfo } from "./error/SalonAddressInfo";

interface MapLoadingStateProps {
  salonName?: string;
  address?: string;
  salonPhone?: string | null;
  hideAddress?: boolean;
  hidePhone?: boolean;
}

export const MapLoadingState = ({ 
  salonName, 
  address, 
  salonPhone,
  hideAddress = false,
  hidePhone = false
}: MapLoadingStateProps) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex flex-col space-y-4">
        <SalonAddressInfo 
          salonName={salonName} 
          address={address} 
          salonPhone={salonPhone}
          hideAddress={hideAddress}
          hidePhone={hidePhone}
        />
        
        <div className="h-[200px] w-full bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
          <span className="text-gray-500">Laddar karta...</span>
        </div>
      </div>
    </div>
  );
};
