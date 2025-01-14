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
      <div className="flex justify-between items-baseline">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3 text-muted-400" />
            <span className="text-xs line-through text-muted-400">
              {formatPrice(originalPrice)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-foreground">
              {formatPrice(discountedPrice)}
            </span>
            <Badge 
              variant="outline" 
              className="text-xs bg-primary/5 text-primary-600 border-primary-100"
            >
              -{discountPercentage}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}