
import { Store, MapPin, Phone } from "lucide-react";

interface SalonInfoProps {
  salon: {
    name: string;
    address: string | null;
    phone: string | null;
  } | null;
  fallbackCity?: string;
}

export const SalonInfo = ({ salon, fallbackCity }: SalonInfoProps) => {
  console.log("[SalonInfo] Rendering with salon data:", salon, "fallbackCity:", fallbackCity);
  
  // Om salongobjektet saknas helt, skapa ett grundläggande visningsobjekt från fallbackCity
  const effectiveSalon = salon || (fallbackCity ? {
    name: `Salong i ${fallbackCity}`,
    address: `${fallbackCity}`,
    phone: null
  } : {
    name: 'Okänd salong',
    address: null,
    phone: null
  });
  
  // Säkerställ att vi har ett giltigt namn, även om salon-objektet är tomt
  const displayName = effectiveSalon.name && effectiveSalon.name.trim() !== '' 
                    ? effectiveSalon.name 
                    : fallbackCity ? `Salong i ${fallbackCity}` : 'Okänd salong';

  // Logga mer detaljerad information för felsökning
  console.log("[SalonInfo] Visar salongsdata:", { 
    name: displayName, 
    address: effectiveSalon.address, 
    phone: effectiveSalon.phone,
    fallbackCity: fallbackCity,
    nameType: typeof effectiveSalon.name,
    nameEmpty: effectiveSalon.name ? effectiveSalon.name.trim() === '' : true
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
        {effectiveSalon.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{effectiveSalon.address}</span>
          </div>
        )}
        {effectiveSalon.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <a href={`tel:${effectiveSalon.phone}`} className="hover:underline">{effectiveSalon.phone}</a>
          </div>
        )}
      </div>
    </div>
  );
};
