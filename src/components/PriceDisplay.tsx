import { Tag } from "lucide-react";
import { Badge } from "./ui/badge";

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
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-foreground">
          {formatPrice(discountedPrice)}
        </span>
        <Badge 
          variant="outline" 
          className="text-sm bg-primary/5 text-primary border-primary/10 font-medium"
        >
          -{discountPercentage}%
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-500" />
        <span className="text-sm line-through text-muted-500">
          {formatPrice(originalPrice)}
        </span>
      </div>
    </div>
  );
}