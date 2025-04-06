
import { MapPin, Phone } from "lucide-react";

interface SalonAddressInfoProps {
  salonName?: string;
  address?: string;
  salonPhone?: string | null;
  hideAddress?: boolean;
  hidePhone?: boolean;
}

export const SalonAddressInfo = ({ 
  salonName, 
  address, 
  salonPhone,
  hideAddress = false,
  hidePhone = false
}: SalonAddressInfoProps) => {
  return (
    <div className="flex flex-col">
      {salonName && <h4 className="text-base font-medium">{salonName}</h4>}
      
      {!hideAddress && address && (
        <div className="flex items-center space-x-2 mt-1">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">{address}</span>
        </div>
      )}
      
      {!hidePhone && salonPhone && (
        <div className="flex items-center space-x-2 mt-1">
          <Phone className="h-4 w-4 text-gray-500" />
          <a 
            href={`tel:${salonPhone}`} 
            className="text-gray-600 hover:text-primary hover:underline"
          >
            {salonPhone}
          </a>
        </div>
      )}
    </div>
  );
};
