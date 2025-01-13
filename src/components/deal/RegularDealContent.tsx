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
    <div className="flex h-full flex-col p-2.5">
      {/* Top section with badges */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <CategoryBadge 
          category={category}
          className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-[12px]"
        />
        <span className="inline-flex items-center gap-0.5 text-[12px] font-medium px-1.5 py-0.5 rounded-full bg-accent/5 text-accent-foreground">
          <Clock className="h-3 w-3" />
          {timeRemaining}
        </span>
      </div>

      {/* Title and description */}
      <div className="mb-1">
        <h3 className="text-[14px] font-semibold leading-tight text-foreground group-hover:text-primary/90 transition-colors line-clamp-2 mb-0.5">
          {title}
        </h3>
        <p className="text-[12px] text-muted-foreground/90 leading-snug line-clamp-2">
          {description}
        </p>
      </div>

      {/* Location and quantity */}
      <div className="flex items-center justify-between text-[12px] mb-1">
        <div className="flex items-center gap-0.5 text-muted-foreground/90">
          <MapPin className="h-3 w-3" />
          <span>{city}</span>
        </div>
        {quantityLeft <= 10 && (
          <span className="px-1.5 py-0.5 rounded-full bg-destructive/5 text-destructive text-[11px] font-medium">
            Endast {quantityLeft} kvar
          </span>
        )}
      </div>

      {/* Price and buy button */}
      <div className="mt-auto space-y-1">
        <PriceDisplay
          originalPrice={originalPrice}
          discountedPrice={discountedPrice}
        />
        <Button 
          className="w-full bg-gradient-to-r from-primary/90 via-primary to-secondary/90 hover:from-primary hover:via-primary-600 hover:to-secondary text-white shadow-sm transition-all duration-300 hover:shadow-md text-[12px] h-8" 
          size="sm"
        >
          <ShoppingBag className="mr-1 h-3 w-3" />
          Köp nu
        </Button>
      </div>
    </div>
  );
};