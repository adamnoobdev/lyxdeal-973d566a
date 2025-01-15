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
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-baseline">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-500" />
            <span className="text-sm line-through text-muted-500">
              {formatPrice(originalPrice)}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-foreground">
              {formatPrice(discountedPrice)}
            </span>
            <Badge 
              variant="outline" 
              className="text-sm bg-primary/10 text-primary border-primary-200 font-medium px-3 py-1"
            >
              -{discountPercentage}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}