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
    <div className="flex h-full flex-col gap-4 p-5">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <CategoryBadge 
          category={category}
          className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        />
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent-foreground">
          <Clock className="h-3.5 w-3.5" />
          {timeRemaining}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex-grow space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary/90 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="space-y-4 mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{city}</span>
          </div>
          {quantityLeft <= 10 && (
            <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
              Endast {quantityLeft} kvar
            </span>
          )}
        </div>

        <div className="space-y-3">
          <PriceDisplay
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            className="pb-1"
          />
          <Button 
            className="w-full bg-gradient-to-r from-primary via-primary-600 to-secondary hover:from-primary-600 hover:via-primary-700 hover:to-secondary-600 text-white shadow-md transition-all duration-300 hover:shadow-lg" 
            size="sm"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Köp nu
          </Button>
        </div>
      </div>
    </div>
  );
};