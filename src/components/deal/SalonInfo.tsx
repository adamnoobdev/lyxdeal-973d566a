
import { Store, MapPin, Phone } from "lucide-react";

interface SalonInfoProps {
  salon: {
    name: string;
    address: string | null;
    phone: string | null;
  } | null;
}

export const SalonInfo = ({ salon }: SalonInfoProps) => {
  console.log("[SalonInfo] Rendering with salon data:", salon);
  
  // Visa laddningsläge om salongsdata saknas helt
  if (!salon) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/5 p-2">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-medium text-foreground">
            Information om salongen laddas...
          </h3>
        </div>
      </div>
    );
  }

  // Säkerställ att vi har ett giltigt namn, även om salon-objektet är tomt
  const displayName = salon.name && salon.name.trim() !== '' 
                    ? salon.name 
                    : 'Okänd salong';

  // Logga mer detaljerad information för felsökning
  console.log("[SalonInfo] Visar salongsdata:", { 
    name: displayName, 
    address: salon.address, 
    phone: salon.phone,
    nameType: typeof salon.name,
    nameEmpty: salon.name ? salon.name.trim() === '' : true
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/5 p-2">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-base font-medium text-foreground">
          {displayName}
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
            <a href={`tel:${salon.phone}`} className="hover:underline">{salon.phone}</a>
          </div>
        )}
      </div>
    </div>
  );
};
