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
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
          {discountPercentage}% rabatt
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-muted-foreground/60 line-through">
          {formatPrice(originalPrice)}
        </span>
        <span className="text-3xl font-bold text-foreground">
          {formatPrice(discountedPrice)}
        </span>
      </div>
    </div>
  );
}