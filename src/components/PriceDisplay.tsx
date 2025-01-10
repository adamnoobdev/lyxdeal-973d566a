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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Tag className="h-4 w-4 text-primary" />
      <span className="text-sm line-through text-muted-foreground/70">
        {formatPrice(originalPrice)}
      </span>
      <span className="text-base font-bold text-foreground">
        {formatPrice(discountedPrice)}
      </span>
    </div>
  );
}