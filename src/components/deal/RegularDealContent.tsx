import { Clock, MapPin } from "lucide-react";
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
    <div className="p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={category} className="shadow-sm" />
          {quantityLeft > 0 && (
            <CategoryBadge
              category={`${quantityLeft} KVAR`}
              variant="default"
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-sm"
            />
          )}
        </div>
        <h3 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm">{city}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm">{timeRemaining}</span>
        </div>
        <PriceDisplay 
          originalPrice={originalPrice}
          discountedPrice={discountedPrice}
        />
        <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md transition-all duration-300 hover:shadow-lg">
          Köp Nu
        </Button>
      </div>
    </div>
  );
};