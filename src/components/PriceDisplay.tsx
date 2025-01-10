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
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2.5">
        <Tag className="h-4 w-4 text-primary" />
        <span className="text-sm line-through text-muted-foreground/60">
          {formatPrice(originalPrice)}
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-white shadow-sm">
          -{discountPercentage}%
        </span>
      </div>
      <span className="block text-3xl font-bold text-foreground tracking-tight">
        {formatPrice(discountedPrice)}
      </span>
    </div>
  );
}