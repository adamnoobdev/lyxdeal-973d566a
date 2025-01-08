import { Clock, MapPin } from "lucide-react";
import { PriceDisplay } from "./PriceDisplay";

interface DealDetailsProps {
  city: string;
  timeRemaining: string;
  originalPrice: number;
  discountedPrice: number;
  className?: string;
  textColor?: string;
}

export const DealDetails = ({
  city,
  timeRemaining,
  originalPrice,
  discountedPrice,
  className = "",
  textColor = "text-muted-foreground"
}: DealDetailsProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <span className={`text-sm ${textColor}`}>{city}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span className={`text-sm ${textColor}`}>{timeRemaining}</span>
      </div>
      <PriceDisplay 
        originalPrice={originalPrice}
        discountedPrice={discountedPrice}
        className={textColor}
      />
    </div>
  );
};