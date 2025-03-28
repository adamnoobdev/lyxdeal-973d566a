
import { MapPin, Store, Phone } from "lucide-react";
import { DirectionsButton } from "./DirectionsButton";

interface MapErrorStateProps {
  address: string;
  errorMessage: string;
  coordinates: [number, number] | null;
  destination: string;
  hideAddress?: boolean;
  salonName?: string;
  salonPhone?: string | null;
}

export const MapErrorState = ({ 
  address, 
  errorMessage, 
  coordinates, 
  destination,
  hideAddress = false,
  salonName,
  salonPhone
}: MapErrorStateProps) => {
  return (
    <div className="p-4 border border-border rounded-md bg-background">
      {salonName && (
        <div className="flex items-center gap-2 mb-2">
          <Store className="h-4 w-4 text-primary" />
          <span className="font-medium">{salonName}</span>
        </div>
      )}
      
      {salonPhone && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Phone className="h-4 w-4" />
          <a href={`tel:${salonPhone}`} className="hover:underline">{salonPhone}</a>
        </div>
      )}
      
      {!hideAddress && address && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
      )}
      
      <div className="mt-2 text-sm text-destructive">{errorMessage}</div>
      
      <div className="mt-4">
        <DirectionsButton 
          coordinates={coordinates} 
          destination={destination} 
        />
      </div>
    </div>
  );
};
