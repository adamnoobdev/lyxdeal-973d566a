import { Store, MapPin, Phone } from "lucide-react";

interface SalonInfoProps {
  salon: {
    name: string;
    address: string | null;
    phone: string | null;
  };
}

export const SalonInfo = ({ salon }: SalonInfoProps) => {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground/70" />
          <span>{salon.name}</span>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {salon.address && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <MapPin className="h-3 w-3" />
            <span>{salon.address}</span>
          </div>
        )}
        {salon.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Phone className="h-3 w-3" />
            <span>{salon.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};