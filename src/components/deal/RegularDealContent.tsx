import { Clock, MapPin, Tag } from "lucide-react";
import { CategoryBadge } from "../CategoryBadge";

interface RegularDealContentProps {
  title: string;
  description: string;
  category: string;
  city: string;
  timeRemaining: string;
  originalPrice: number;
  discountedPrice: number;
  quantityLeft: number;
}

export const RegularDealContent = ({
  title,
  description,
  category,
  city,
  timeRemaining,
  originalPrice,
  discountedPrice,
  quantityLeft,
}: RegularDealContentProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <CategoryBadge 
          category={category}
          variant="outline"
          className="mb-2 bg-white/50 backdrop-blur-sm"
        />
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
          <Clock className="h-4 w-4 text-primary" />
          <span>{timeRemaining}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm line-through text-muted-foreground/70">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-base font-bold">
              {formatPrice(discountedPrice)}
            </span>
          </div>
          {quantityLeft > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
              {quantityLeft} kvar
            </span>
          )}
        </div>
      </div>
    </div>
  );
};