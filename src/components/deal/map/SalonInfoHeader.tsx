
import { Store, Phone, MapPin } from 'lucide-react';

interface SalonInfoHeaderProps {
  salonName: string | null;
  salonPhone?: string | null;
  address?: string | null;
  hideAddress?: boolean;
}

export const SalonInfoHeader = ({
  salonName,
  salonPhone,
  address,
  hideAddress = false
}: SalonInfoHeaderProps) => {
  // Säkerställ att vi alltid har ett namn att visa
  const displayName = salonName || 'Okänd salong';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Store className="h-4 w-4 text-primary" />
        <span className="font-medium">{displayName}</span>
      </div>
      
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
    </div>
  );
};
