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
          className="bg-gradient-to-r from-[#D946EF]/90 to-[#9b87f5]/90 text-white font-semibold shadow-sm backdrop-blur-md"
        />
        <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-accent text-accent-foreground">
          <Clock className="h-3.5 w-3.5" />
          {timeRemaining}
        </div>
      </div>

      <div className="space-y-2.5">
        <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary/90 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between border-t border-accent/10 pt-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {city}
          </div>
          <span className="text-sm px-2.5 py-1 rounded-full bg-success/10 text-success font-medium ring-1 ring-success/20">
            {quantityLeft} kvar
          </span>
        </div>

        <div className="space-y-3">
          <PriceDisplay
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            className="pt-1"
          />
          <Button 
            className="w-full bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 text-white font-semibold shadow-md" 
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