
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DirectionsButtonProps {
  coordinates: [number, number] | null;
  destination: string;
}

export const DirectionsButton = ({ coordinates, destination }: DirectionsButtonProps) => {
  if (!coordinates) return null;
  
  const [lng, lat] = coordinates;
  
  // Create Google Maps directions URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  
  return (
    <Button 
      variant="outline" 
      className="w-full text-primary border-primary hover:bg-primary/5"
      onClick={() => window.open(googleMapsUrl, '_blank')}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Vägbeskrivning
    </Button>
  );
};
