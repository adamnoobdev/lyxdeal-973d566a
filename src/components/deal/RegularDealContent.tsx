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
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="space-y-2">
        <CategoryBadge 
          category={category} 
          variant="outline" 
          className="transition-all duration-300 hover:bg-accent"
        />
        <h3 className="font-bold tracking-tight line-clamp-2 transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}</span>
        </div>
        
        <div className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1">
          <Clock className="h-4 w-4 text-primary" />
          <span>{timeRemaining}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <PriceDisplay 
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
          />
          {quantityLeft > 0 && (
            <span className="text-xs text-emerald-600 transition-all duration-300 hover:scale-105">
              {quantityLeft} kvar
            </span>
          )}
        </div>
        
        <Button className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          Köp Nu
        </Button>
      </div>
    </div>
  );
};