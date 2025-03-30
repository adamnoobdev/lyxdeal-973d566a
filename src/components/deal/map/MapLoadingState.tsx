
import { MapPin, Store, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapLoadingStateProps {
  address?: string;
  hideAddress?: boolean;
  salonName?: string | null;
  salonPhone?: string | null;
}

export const MapLoadingState = ({ 
  address = '', 
  hideAddress = false,
  salonName,
  salonPhone
}: MapLoadingStateProps) => {
  return (
    <div className="space-y-4">
      {/* Salon info section */}
      <div className="space-y-2">
        {salonName ? (
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            <span className="font-medium">{salonName}</span>
          </div>
        ) : (
          <Skeleton className="h-5 w-32" />
        )}
        
        {salonPhone ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${salonPhone}`} className="hover:underline">{salonPhone}</a>
          </div>
        ) : (
          <Skeleton className="h-4 w-28" />
        )}
        
        {!hideAddress && address ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{address}</span>
          </div>
        ) : !hideAddress && (
          <Skeleton className="h-4 w-48" />
        )}
      </div>
      
      {/* Map placeholder */}
      <div className="h-48 w-full rounded-md overflow-hidden border border-border">
        <div className="h-full w-full bg-accent/5 animate-pulse flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Laddar karta...</div>
        </div>
      </div>
      
      {/* Button placeholder */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
