
import { DirectionsButton } from "./DirectionsButton";
import { SalonAddressInfo, ErrorAlert, AddressTipsList } from "./error";

interface MapErrorStateProps {
  address?: string;
  errorMessage: string;
  coordinates?: [number, number] | null;
  destination?: string;
  hideAddress?: boolean;
  salonName?: string | null;
  salonPhone?: string | null;
  city?: string | null;
}

export const MapErrorState = ({ 
  address = '', 
  errorMessage, 
  coordinates = null, 
  destination = '',
  hideAddress = false,
  salonName,
  salonPhone,
  city
}: MapErrorStateProps) => {
  // Använd staden som fallback om adress saknas helt
  const displayAddress = address || (city ? `${city} centrum` : '');
  
  return (
    <div className="p-4 border border-border rounded-md bg-background">
      <div className="space-y-4">
        {/* Salon info section */}
        <SalonAddressInfo 
          salonName={salonName || undefined}
          salonPhone={salonPhone}
          address={displayAddress}
          hideAddress={hideAddress || !displayAddress}
        />
        
        {/* Error alert */}
        <ErrorAlert errorMessage={errorMessage} />
        
        {/* Tips to fix address problems */}
        <AddressTipsList />
        
        {/* Directions button if address or city is available */}
        {(displayAddress) && (
          <div className="mt-4">
            <DirectionsButton 
              address={displayAddress}
              coordinates={coordinates}
              destination={destination}
            />
          </div>
        )}
      </div>
    </div>
  );
};
