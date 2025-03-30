import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectionsButtonProps {
  address?: string;
  coordinates?: [number, number];
  destination?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export const DirectionsButton = ({ 
  address, 
  coordinates,
  destination,
  className = "", 
  variant = "default" 
}: DirectionsButtonProps) => {
  if (!address && !coordinates) return null;

  const getDirectionsUrl = (destination: string | [number, number]) => {
    if (Array.isArray(destination)) {
      // If coordinates are provided, use them
      const [lng, lat] = destination;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      // Otherwise use address
      const encodedAddress = encodeURIComponent(destination);
      return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }
  };

  const targetDestination = destination || coordinates || address;

  return (
    <Button 
      variant={variant}
      size="sm"
      className={`gap-2 ${className}`}
      onClick={() => window.open(getDirectionsUrl(targetDestination as any), '_blank')}
    >
      <Navigation className="h-4 w-4" />
      <span>Vägbeskrivning</span>
    </Button>
  );
};
