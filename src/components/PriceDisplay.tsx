
import { Tag } from "lucide-react";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
  isFreeOverride?: boolean;
}

export function PriceDisplay({ 
  originalPrice, 
  discountedPrice, 
  className = "",
  isFreeOverride = false
}: PriceDisplayProps) {
  const isFree = isFreeOverride || originalPrice === 0 || discountedPrice === 0;
  
  const formatPrice = (price: number) => {
    if (isFree) return "GRATIS";
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = isFree ? 100 : Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(discountedPrice)}
        </span>
        {!isFree && originalPrice > 0 && (
          <span className="text-sm px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
            -{discountPercentage}%
          </span>
        )}
        {isFree && (
          <span className="text-sm px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
            GRATIS
          </span>
        )}
      </div>
      {!isFree && originalPrice > 0 && (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Tag className="h-4 w-4" />
          <span className="text-sm line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>
      )}
    </div>
  );
}
