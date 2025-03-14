
import { Tag } from "lucide-react";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
  isFreeOverride?: boolean;
  showZero?: boolean;
}

export function PriceDisplay({ 
  originalPrice, 
  discountedPrice, 
  className = "",
  isFreeOverride = false,
  showZero = false,
}: PriceDisplayProps) {
  // Alla erbjudanden är gratis nu
  const isFree = true;
  
  const formatPrice = (price: number) => {
    // För att visa det rabatterade (gratis) priset
    if (isFree && (price === discountedPrice)) {
      if (showZero) {
        return new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK',
          maximumFractionDigits: 0
        }).format(0); // Force 0 här för att visa "0 kr"
      }
      return "GRATIS";
    }
    
    // För att visa ordinarie pris
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(0)}
        </span>
        <span className="text-sm px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
          GRATIS
        </span>
      </div>
      {originalPrice > 0 && ( 
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
