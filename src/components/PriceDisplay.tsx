import { Tag } from "lucide-react";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
}

export function PriceDisplay({ originalPrice, discountedPrice, className = "" }: PriceDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(discountedPrice)}
        </span>
        <span className="text-sm px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
          -{discountPercentage}%
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Tag className="h-4 w-4" />
        <span className="text-sm line-through">
          {formatPrice(originalPrice)}
        </span>
      </div>
    </div>
  );
}