
import { MapPin } from "lucide-react";

interface MapLoadingStateProps {
  address: string;
  hideAddress?: boolean;
}

export const MapLoadingState = ({ address, hideAddress = false }: MapLoadingStateProps) => {
  return (
    <div className="p-4 border border-border rounded-md bg-background">
      {!hideAddress && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
      )}
      <div className="h-48 w-full rounded-md overflow-hidden border border-border mt-4 flex items-center justify-center bg-accent/5">
        <div className="animate-pulse">Laddar karta...</div>
      </div>
    </div>
  );
};
