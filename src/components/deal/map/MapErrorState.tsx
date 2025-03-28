
import { MapPin, Store, Phone, AlertCircle } from "lucide-react";
import { DirectionsButton } from "./DirectionsButton";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <div className="space-y-4">
        {/* Salon info section */}
        <div className="space-y-2">
          {salonName && (
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              <span className="font-medium">{salonName}</span>
            </div>
          )}
          
          {salonPhone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${salonPhone}`} className="hover:underline">{salonPhone}</a>
            </div>
          )}
          
          {!hideAddress && address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
          )}
        </div>
        
        {/* Error alert */}
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-sm">
            {errorMessage}
          </AlertDescription>
        </Alert>
        
        {/* Tips to fix address problems */}
        <div className="text-sm text-muted-foreground mt-2">
          <p className="font-medium">Tips:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Kontrollera att adressen är korrekt och fullständig</li>
            <li>Inkludera gatunummer, postnummer och stad</li>
            <li>Exempel på bra format: "Torsplan 8, 113 65 Stockholm"</li>
          </ul>
        </div>
        
        {/* Directions button if coordinates are available */}
        {coordinates && (
          <div className="mt-4">
            <DirectionsButton 
              coordinates={coordinates} 
              destination={destination} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
