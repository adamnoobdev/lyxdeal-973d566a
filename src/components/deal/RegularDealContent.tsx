import { Clock, MapPin, Tag, Award } from "lucide-react";
import { CategoryBadge } from "../CategoryBadge";
import { Button } from "../ui/button";

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
    <div className="p-5 space-y-4">
      <div>
        <CategoryBadge 
          category={category}
          variant="outline"
          className="mb-2.5 bg-white/50 backdrop-blur-sm border-accent/20 text-primary hover:bg-accent/5 transition-colors duration-300 flex items-center gap-1.5"
        >
          <Award className="h-3.5 w-3.5" />
          {category}
        </CategoryBadge>
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground/80 line-clamp-2 mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground/90 group-hover:text-muted-foreground/80 transition-colors duration-300">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground/90 group-hover:text-muted-foreground/80 transition-colors duration-300">
          <Clock className="h-4 w-4 text-primary" />
          <span>{timeRemaining}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm line-through text-muted-foreground/60">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-base font-bold text-foreground">
              {formatPrice(discountedPrice)}
            </span>
          </div>
          {quantityLeft > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success ring-1 ring-success/20">
              {quantityLeft} kvar
            </span>
          )}
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          Köp Nu
        </Button>
      </div>
    </div>
  );
};