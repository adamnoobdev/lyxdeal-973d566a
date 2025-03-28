
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectionsButtonProps {
  coordinates: [number, number] | null;
  destination: string;
}

export const DirectionsButton = ({ coordinates, destination }: DirectionsButtonProps) => {
  // Skapa Google Maps-riktnings-URL
  const getDirectionsUrl = () => {
    if (coordinates) {
      // Använd koordinater om tillgängliga
      return `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}&travelmode=driving`;
    } else {
      // Annars använd destinationstext
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full text-sm"
      size="sm"
      onClick={() => window.open(getDirectionsUrl(), '_blank')}
    >
      <MapPin className="h-4 w-4 mr-2" />
      <span>Visa vägbeskrivning</span>
    </Button>
  );
};
