
import { MapPin } from "lucide-react";
import { DirectionsButton } from "./DirectionsButton";

interface MapErrorStateProps {
  address: string;
  errorMessage: string;
  coordinates: [number, number] | null;
  destination: string;
}

export const MapErrorState = ({ 
  address, 
  errorMessage, 
  coordinates, 
  destination 
}: MapErrorStateProps) => {
  return (
    <div className="p-4 border border-border rounded-md bg-background">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{address}</span>
      </div>
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
