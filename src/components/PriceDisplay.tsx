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
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <span className="text-sm line-through text-muted-foreground/60">
          {formatPrice(originalPrice)}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          -{discountPercentage}%
        </span>
      </div>
      <span className="block text-2xl font-bold text-foreground">
        {formatPrice(discountedPrice)}
      </span>
    </div>
  );
}