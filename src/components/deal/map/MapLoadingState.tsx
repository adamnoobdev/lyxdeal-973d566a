
import { MapPin, Store, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapLoadingStateProps {
  address: string;
  hideAddress?: boolean;
  salonName?: string;
  salonPhone?: string | null;
}

export const MapLoadingState = ({ 
  address, 
  hideAddress = false,
  salonName,
  salonPhone
}: MapLoadingStateProps) => {
  return (
    <div className="space-y-4">
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
      
      <div className="h-48 w-full rounded-md overflow-hidden border border-border">
        <div className="h-full w-full bg-accent/5 animate-pulse flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Laddar karta...</div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
