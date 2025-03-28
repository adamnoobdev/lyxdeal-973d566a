
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface DirectionsButtonProps {
  coordinates: [number, number] | null;
  destination: string;
  className?: string;
}

export const DirectionsButton = ({ coordinates, destination, className }: DirectionsButtonProps) => {
  const handleGetDirections = () => {
    if (!coordinates) return;
    
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  };

  return (
    <Button 
      variant="outline" 
      className={className || "w-full"}
      onClick={handleGetDirections}
      disabled={!coordinates}
    >
      <Navigation className="h-4 w-4 mr-2" />
      Få vägbeskrivning
    </Button>
  );
};
