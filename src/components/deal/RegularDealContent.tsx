import { CategoryBadge } from "@/components/CategoryBadge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag, Clock } from "lucide-react";

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
    <div className="flex h-full flex-col gap-2 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <CategoryBadge 
          category={category}
          variant="default"
          className="bg-primary/90 hover:bg-primary text-white shadow-sm transition-colors text-xs"
        />
        <div className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
          <Clock className="h-3 w-3" />
          {timeRemaining}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground group-hover:text-primary/90 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {city}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
              {quantityLeft} kvar
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <PriceDisplay
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            className="pb-1 text-sm"
          />
          <Button 
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-semibold shadow-md transition-all duration-300 text-xs py-2" 
            size="sm"
          >
            <ShoppingBag className="mr-1.5 h-3 w-3" />
            Köp nu
          </Button>
        </div>
      </div>
    </div>
  );
};