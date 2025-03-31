
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
  // Om inga koordinater och inget fullständigt addressfält, använd staden som fallback
  const displayAddress = address || (city ? `${city} centrum` : '');
  const hasSomeLocation = !!displayAddress || !!city;
  
  console.log("[MapErrorState] Rendering with:", {
    address,
    displayAddress,
    errorMessage,
    coordinates,
    city,
    salonName,
    hasLocation: hasSomeLocation
  });
  
  return (
    <div className="p-4 border border-border rounded-md bg-background">
      <div className="space-y-4">
        {/* Salon info section */}
        <SalonAddressInfo 
          salonName={salonName || (city ? `Salong i ${city}` : undefined)}
          salonPhone={salonPhone}
          address={displayAddress}
          hideAddress={hideAddress || !displayAddress}
        />
        
        {/* Error alert - bara om det inte är ett "saknad adress"-fel och vi faktiskt har en stad */}
        {!(errorMessage.includes("saknas") && hasSomeLocation) && (
          <ErrorAlert errorMessage={errorMessage} />
        )}
        
        {/* Tips för adressrelaterade problem */}
        {errorMessage.includes("adress") && !hasSomeLocation && (
          <AddressTipsList />
        )}
        
        {/* Directions button if we have any location info */}
        {hasSomeLocation && (
          <div className="mt-4">
            <DirectionsButton 
              address={displayAddress || (city ? city : '')}
              coordinates={coordinates}
              destination={destination || (city ? city : '')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
