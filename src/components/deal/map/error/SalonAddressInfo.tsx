
import { Store, Phone, MapPin } from "lucide-react";

interface SalonAddressInfoProps {
  salonName?: string;
  salonPhone?: string | null;
  address: string;
  hideAddress?: boolean;
}

export const SalonAddressInfo = ({ 
  salonName, 
  salonPhone, 
  address, 
  hideAddress = false 
}: SalonAddressInfoProps) => {
  // Om salongsnamnet saknas, visa ett standardnamn
  const displayName = salonName || 'Salong';
  
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
