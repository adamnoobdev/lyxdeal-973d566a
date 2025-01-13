import { Tag } from "lucide-react";
import { Badge } from "./ui/badge";

interface PriceDisplayProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({ 
  originalPrice, 
  discountedPrice, 
  className = "",
  size = "md"
}: PriceDisplayProps) {
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

  const priceTextSize = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl"
  }[size];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base line-through text-muted-foreground/60">
            {formatPrice(originalPrice)}
          </span>
          <Badge variant="default" className="bg-primary text-primary-foreground">
            -{discountPercentage}%
          </Badge>
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`${priceTextSize} font-bold text-foreground`}>
            {formatPrice(discountedPrice)}
          </span>
          <Badge 
            variant="outline" 
            className="bg-success-50 text-success-700 border-success-200"
          >
            Du sparar {formatPrice(savings)}
          </Badge>
        </div>
      </div>
    </div>
  );
}