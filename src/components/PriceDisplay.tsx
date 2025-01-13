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

  const savings = originalPrice - discountedPrice;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-baseline">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-xs line-through text-muted-foreground/60">
              {formatPrice(originalPrice)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(discountedPrice)}
            </span>
            <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
              -{discountPercentage}%
            </Badge>
          </div>
        </div>
        <Badge variant="outline" className="bg-success-50 text-success-700 border-success-200 text-xs">
          Du sparar {formatPrice(savings)}
        </Badge>
      </div>
    </div>
  );
}