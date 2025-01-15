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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/5 p-2">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-base font-medium text-foreground">
          {salon.name}
        </h3>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        {salon.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{salon.address}</span>
          </div>
        )}
        {salon.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{salon.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};