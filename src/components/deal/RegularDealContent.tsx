import { MapPin, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { CategoryBadge } from "../CategoryBadge";
import { PriceDisplay } from "../PriceDisplay";

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
  return (
    <div className="p-5 space-y-4">
      <div className="space-y-3">
        <CategoryBadge 
          category={category} 
          variant="outline" 
          className="transition-all duration-300 hover:bg-accent"
        />
        <h3 className="text-lg font-bold tracking-tight line-clamp-2 transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground transition-transform duration-300 hover:translate-x-1">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground transition-transform duration-300 hover:translate-x-1">
          <Clock className="h-4 w-4 text-primary" />
          <span>{timeRemaining}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <PriceDisplay 
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
          />
          {quantityLeft > 0 && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {quantityLeft} kvar
            </span>
          )}
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
          Köp Nu
        </Button>
      </div>
    </div>
  );
};