
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectionsButtonProps {
  address?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export const DirectionsButton = ({ 
  address, 
  className = "", 
  variant = "default" 
}: DirectionsButtonProps) => {
  if (!address) return null;

  const getDirectionsUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  return (
    <Button 
      variant={variant}
      size="sm"
      className={`gap-2 ${className}`}
      onClick={() => window.open(getDirectionsUrl(address), '_blank')}
    >
      <Navigation className="h-4 w-4" />
      <span>Vägbeskrivning</span>
    </Button>
  );
};
