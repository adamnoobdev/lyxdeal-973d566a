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
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge 
          category={category}
          variant="default"
          className="bg-primary/90 hover:bg-primary text-white shadow-sm transition-colors"
        />
        <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-accent/20 text-accent-foreground">
          <Clock className="h-3.5 w-3.5" />
          {timeRemaining}
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary/90 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {city}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm px-2.5 py-0.5 rounded-full ${
              quantityLeft <= 5 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-success/10 text-success'
            } font-medium`}>
              {quantityLeft} kvar
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <PriceDisplay
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            className="pb-2"
          />
          <Button 
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-semibold shadow-md transition-all duration-300" 
            size="lg"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Köp nu
          </Button>
        </div>
      </div>
    </div>
  );
};