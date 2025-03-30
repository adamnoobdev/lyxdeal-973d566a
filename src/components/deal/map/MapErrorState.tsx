
import { DirectionsButton } from "./DirectionsButton";
import { SalonAddressInfo, ErrorAlert, AddressTipsList } from "./error";

interface MapErrorStateProps {
  address: string;
  errorMessage: string;
  coordinates?: [number, number] | null;
  destination?: string;
  hideAddress?: boolean;
  salonName?: string | null;
  salonPhone?: string | null;
}

export const MapErrorState = ({ 
  address, 
  errorMessage, 
  coordinates = null, 
  destination = '',
  hideAddress = false,
  salonName,
  salonPhone
}: MapErrorStateProps) => {
  return (
    <div className="p-4 border border-border rounded-md bg-background">
      <div className="space-y-4">
        {/* Salon info section */}
        <SalonAddressInfo 
          salonName={salonName || undefined}
          salonPhone={salonPhone}
          address={address}
          hideAddress={hideAddress}
        />
        
        {/* Error alert */}
        <ErrorAlert errorMessage={errorMessage} />
        
        {/* Tips to fix address problems */}
        <AddressTipsList />
        
        {/* Directions button if address is available */}
        {address && (
          <div className="mt-4">
            <DirectionsButton 
              address={address}
              coordinates={coordinates || undefined}
              destination={destination || undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};
