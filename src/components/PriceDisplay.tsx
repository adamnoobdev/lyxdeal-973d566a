
import { Tag } from "lucide-react";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
  isFreeOverride?: boolean;
  showZero?: boolean;
  showSavedAmount?: boolean;
  showDiscountBadge?: boolean;
}

export function PriceDisplay({ 
  originalPrice, 
  discountedPrice, 
  className = "",
  isFreeOverride = false,
  showZero = false,
  showSavedAmount = false,
  showDiscountBadge = true,
}: PriceDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercentage = originalPrice > 0 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
    : 0;

  // Check if it's free (either 0 price or override)
  const isFree = discountedPrice === 0 || isFreeOverride;

  // Calculate saved amount
  const savedAmount = originalPrice - discountedPrice;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {isFree ? "Gratis" : formatPrice(discountedPrice)}
        </span>
        {showDiscountBadge && discountPercentage > 0 && (
          <span className="text-sm px-2 py-0.5 bg-[#ea384c] text-white font-medium">
            -{discountPercentage}%
          </span>
        )}
      </div>
      {originalPrice > (isFree ? 0 : discountedPrice) && ( 
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Tag className="h-4 w-4" />
            <span className="text-sm line-through">
              {formatPrice(originalPrice)}
            </span>
          </div>
          {showSavedAmount && savedAmount > 0 && (
            <span className="text-sm text-[#ea384c] font-medium mt-1">
              Du sparar {formatPrice(savedAmount)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
