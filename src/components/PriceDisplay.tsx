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
    <div className={`flex items-end justify-between ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="text-sm line-through text-muted-foreground/60">
            {formatPrice(originalPrice)}
          </span>
        </div>
        <span className="block text-3xl font-bold text-foreground tracking-tight">
          {formatPrice(discountedPrice)}
        </span>
      </div>
      <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-primary text-white shadow-sm self-start">
        -{discountPercentage}%
      </span>
    </div>
  );
}