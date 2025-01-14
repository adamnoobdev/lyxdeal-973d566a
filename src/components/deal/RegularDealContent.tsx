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
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <CategoryBadge 
          category={category}
          variant="default"
          className="text-xs bg-gradient-to-r from-primary-300 to-secondary-300 text-primary-900 border-none"
        />
        <div className="flex items-center gap-1 text-xs text-primary-600">
          <Clock className="h-3 w-3" />
          {timeRemaining}
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-medium leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-muted-500 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-secondary-600">
            <MapPin className="h-3 w-3" />
            {city}
          </div>
          {quantityLeft <= 5 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
              {quantityLeft} kvar
            </span>
          )}
        </div>

        <div className="space-y-2">
          <PriceDisplay
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            className="pb-1 text-sm"
          />
          <Button 
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white border-none text-xs py-2 shadow-sm" 
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