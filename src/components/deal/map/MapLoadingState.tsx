
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapLoadingStateProps {
  address: string;
  hideAddress?: boolean;
}

export const MapLoadingState = ({ address, hideAddress = false }: MapLoadingStateProps) => {
  return (
    <div className="space-y-4">
      {!hideAddress && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pl-2">
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
